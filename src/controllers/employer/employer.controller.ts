import { Request, Response } from "express";


export const registerEmployer = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        req.log.error({ err: error}, 'Employer registration failed');

        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}