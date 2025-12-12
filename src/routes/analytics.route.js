import {Router} from 'express'

import {analyticOverview} from '../controllers/analytics.controllers.js'
import verifyJwt from '../middlewares/auth.middlewares.js'

const router = Router();



router.route('/overview').get(verifyJwt, analyticOverview)



export default router