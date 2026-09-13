# InterHive Database Schema

## Overview
InterHive uses MongoDB as its primary database. This document outlines the database schema, relationships, and indexing strategy.

## Collections

### Users
```javascript
{
  _id: ObjectId,
  employeeId: String,          // Unique employee identifier
  firstName: String,
  lastName: String,
  email: String,               // Unique
  password: String,            // Hashed
  role: String,                // admin, hr, manager, intern, company
  department: ObjectId,        // Reference to Department
  position: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  dateOfBirth: Date,
  gender: String,              // male, female, other
  joiningDate: Date,
  employmentType: String,      // full-time, part-time, contract, intern
  manager: ObjectId,           // Reference to User
  profilePhoto: String,
  skills: [String],
  education: [{
    degree: String,
    institution: String,
    year: Number,
    grade: String
  }],
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    accountHolder: String
  },
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedAt: Date
  }],
  isActive: Boolean,
  isVerified: Boolean,
  lastLogin: Date,
  loginHistory: [{
    timestamp: Date,
    ip: String,
    userAgent: String,
    location: String
  }],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  preferences: {
    theme: String,             // light, dark
    notifications: {
      email: Boolean,
      push: Boolean,
      sms: Boolean
    }
  },
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ employeeId: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ department: 1 })
db.users.createIndex({ isActive: 1 })