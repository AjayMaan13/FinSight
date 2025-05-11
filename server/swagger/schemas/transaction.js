/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - amount
 *         - description
 *         - category
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         amount:
 *           type: number
 *           format: float
 *           minimum: 0.01
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         type:
 *           type: string
 *           enum: [income, expense]
 *         date:
 *           type: string
 *           format: date
 *         notes:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         userId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */