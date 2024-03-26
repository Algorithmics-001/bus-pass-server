/**
 * @swagger
 * /college/login:
 *   post:
 *     summary: College Login
 *     description: Endpoint for college login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               college:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /college/dashboard:
 *   get:
 *     summary: College Dashboard
 *     description: Endpoint to retrieve college dashboard data.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   number:
 *                     type: integer
 *                   text:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /college/requests:
 *   get:
 *     summary: College Requests
 *     description: Endpoint to retrieve college requests.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved college requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   course:
 *                     type: string
 *                   batch:
 *                     type: integer
 *                   semester:
 *                     type: integer
 *                   rollno:
 *                     type: integer
 *                   department:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: integer
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /bus-service/login:
 *   post:
 *     summary: Bus Service Login
 *     description: Endpoint for bus service login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bus-service:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /bus-service/dashboard:
 *   get:
 *     summary: Bus Service Dashboard
 *     description: Endpoint to retrieve bus service dashboard data.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   number:
 *                     type: integer
 *                   text:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /bus-service/requests:
 *   get:
 *     summary: Bus Service Requests
 *     description: Endpoint to retrieve bus service requests.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved bus service requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   college:
 *                     type: string
 *                   rollno:
 *                     type: integer
 *                   department:
 *                     type: string
 *                   phone:
 *                     type: integer
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: Authorization
 */
