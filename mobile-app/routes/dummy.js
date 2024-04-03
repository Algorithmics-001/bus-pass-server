require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');


router.get('/bus-service/requests', async (req, res) => {
    const test = [
        {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "course": "Computer Science",
          "batch": 2022,
          "semester": 3,
          "rollno": 1234,
          "department": "Engineering",
          "address": "123 Main Street",
          "phone": 1234567890,
        },
        {
          "name": "Alice Smith",
          "email": "alice.smith@example.com",
          "course": "Business Administration",
          "batch": 2023,
          "semester": 2,
          "rollno": 5678,
          "department": "Business",
          "address": "456 Elm Street",
          "phone": 9876543210,
        },
        {
          "name": "Bob Johnson",
          "email": "bob.johnson@example.com",
          "course": "Psychology",
          "batch": 2021,
          "semester": 4,
          "rollno": 9101,
          "department": "Arts",
          "address": "789 Oak Street",
          "phone": 1357924680,
        },
        {
          "name": "Emily Brown",
          "email": "emily.brown@example.com",
          "course": "Biology",
          "batch": 2020,
          "semester": 5,
          "rollno": 1121,
          "department": "Science",
          "address": "101 Pine Street",
          "phone": 2468013579,
        },
        {
          "name": "Michael Wilson",
          "email": "michael.wilson@example.com",
          "course": "Economics",
          "batch": 2024,
          "semester": 1,
          "rollno": 3141,
          "department": "Social Sciences",
          "address": "202 Cedar Street",
          "phone": 9871234560,
        },
        {
          "name": "Sarah Taylor",
          "email": "sarah.taylor@example.com",
          "course": "History",
          "batch": 2022,
          "semester": 6,
          "rollno": 4151,
          "department": "Humanities",
          "address": "303 Walnut Street",
          "phone": 3692581470,
        },
        {
          "name": "David Martinez",
          "email": "david.martinez@example.com",
          "course": "Chemistry",
          "batch": 2023,
          "semester": 3,
          "rollno": 6171,
          "department": "Science",
          "address": "404 Maple Street",
          "phone": 9517534680,
        },
        {
          "name": "Jennifer Garcia",
          "email": "jennifer.garcia@example.com",
          "course": "English Literature",
          "batch": 2021,
          "semester": 7,
          "rollno": 8191,
          "department": "Arts",
          "address": "505 Birch Street",
          "phone": 1239874560,
        },
        {
          "name": "Daniel Brown",
          "email": "daniel.brown@example.com",
          "course": "Physics",
          "batch": 2020,
          "semester": 2,
          "rollno": 9201,
          "department": "Science",
          "address": "606 Cedar Street",
          "phone": 7896541230,
        },
        {
          "name": "Jessica Nguyen",
          "email": "jessica.nguyen@example.com",
          "course": "Mathematics",
          "batch": 2024,
          "semester": 4,
          "rollno": 1221,
          "department": "Science",
          "address": "707 Pine Street",
          "phone": 4563217890,
        }
    ];
    res.status(200).json(test);
});

router.get('/college/requests', async (req, res) => {
    const test = [
        {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "course": "Computer Science",
          "batch": 2022,
          "semester": 3,
          "rollno": 1234,
          "department": "Engineering",
          "address": "123 Main Street",
          "phone": 1234567890,
        },
        {
          "name": "Alice Smith",
          "email": "alice.smith@example.com",
          "course": "Business Administration",
          "batch": 2023,
          "semester": 2,
          "rollno": 5678,
          "department": "Business",
          "address": "456 Elm Street",
          "phone": 9876543210,
        },
        {
          "name": "Bob Johnson",
          "email": "bob.johnson@example.com",
          "course": "Psychology",
          "batch": 2021,
          "semester": 4,
          "rollno": 9101,
          "department": "Arts",
          "address": "789 Oak Street",
          "phone": 1357924680,
        },
        {
          "name": "Emily Brown",
          "email": "emily.brown@example.com",
          "course": "Biology",
          "batch": 2020,
          "semester": 5,
          "rollno": 1121,
          "department": "Science",
          "address": "101 Pine Street",
          "phone": 2468013579,
        },
        {
          "name": "Michael Wilson",
          "email": "michael.wilson@example.com",
          "course": "Economics",
          "batch": 2024,
          "semester": 1,
          "rollno": 3141,
          "department": "Social Sciences",
          "address": "202 Cedar Street",
          "phone": 9871234560,
        },
        {
          "name": "Sarah Taylor",
          "email": "sarah.taylor@example.com",
          "course": "History",
          "batch": 2022,
          "semester": 6,
          "rollno": 4151,
          "department": "Humanities",
          "address": "303 Walnut Street",
          "phone": 3692581470,
        },
        {
          "name": "David Martinez",
          "email": "david.martinez@example.com",
          "course": "Chemistry",
          "batch": 2023,
          "semester": 3,
          "rollno": 6171,
          "department": "Science",
          "address": "404 Maple Street",
          "phone": 9517534680,
        },
        {
          "name": "Jennifer Garcia",
          "email": "jennifer.garcia@example.com",
          "course": "English Literature",
          "batch": 2021,
          "semester": 7,
          "rollno": 8191,
          "department": "Arts",
          "address": "505 Birch Street",
          "phone": 1239874560,
        },
        {
          "name": "Daniel Brown",
          "email": "daniel.brown@example.com",
          "course": "Physics",
          "batch": 2020,
          "semester": 2,
          "rollno": 9201,
          "department": "Science",
          "address": "606 Cedar Street",
          "phone": 7896541230,
        },
        {
          "name": "Jessica Nguyen",
          "email": "jessica.nguyen@example.com",
          "course": "Mathematics",
          "batch": 2024,
          "semester": 4,
          "rollno": 1221,
          "department": "Science",
          "address": "707 Pine Street",
          "phone": 4563217890,
        }
    ];
    res.status(200).json(test);
});

router.get('/college/dashboard', (req, res) => {
    const test = [
        {number:100, text:"Students Accepted"},
        {number:100, text:"Students Rejected"},
        {number:100, text:"Students Applied"},
        {number:100, text:"Students account Approved"},
        {number:100, text:"huehue"}
    ]
    res.status(200).json(test);
});

router.get('/bus-service/dashboard', (req, res) => {
    const test = [
        {number:100, text:"Students Accepted"},
        {number:100, text:"Students Rejected"},
        {number:100, text:"Students Applied"},
        {number:100, text:"Students account Approved"},
        {number:100, text:"huehue"}
    ]
    res.status(200).json(test);
});

module.exports = router;