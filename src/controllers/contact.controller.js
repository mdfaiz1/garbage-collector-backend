import { Contact } from "../models/contact.model.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!email || !message) {
      return res.status(400).json({
        success: false,
        message: "Email and message are required",
      });
    }

    // Create new contact entry
    const newContact = await Contact.create({
      name,
      email,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Contact created successfully",
      contact: newContact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    if (contacts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No contacts found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Contacts retrieved successfully",
      contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate contact ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Contact ID is required",
      });
    }

    // Find and delete the contact
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      contact: deletedContact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
