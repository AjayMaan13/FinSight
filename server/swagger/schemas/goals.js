/**
 * @swagger
 * components:
 *   schemas:
 *     Goal:
 *       type: object
 *       required:
 *         - name
 *         - targetAmount
 *         - targetDate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         targetAmount:
 *           type: number
 *           format: float
 *           minimum: 0.01
 *         currentAmount:
 *           type: number
 *           format: float
 *           default: 0
 *         targetDate:
 *           type: string
 *           format: date
 *         category:
 *           type: string
 *           default: General
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           default: medium
 *         status:
 *           type: string
 *           enum: [active, completed, cancelled]
 *           default: active
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