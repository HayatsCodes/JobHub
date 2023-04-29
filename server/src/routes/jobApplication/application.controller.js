const fs = require('fs');
const applicationModel = require('../../models/jobApplication.model');

async function addApplication(req, res) {
    const application = new applicationModel({
        ...req.body,
        user: req.user.id,
    });

    if (req.file) {
        application.resume = {
            name: req.file.filename,
            data: fs.readFileSync(req.file.path),
            contentType: 'application/pdf'
        }
        await application.save();
        //   delete the uploaded file from the local disc
        fs.unlinkSync(req.file.path);

        return res.status(201).json({ ...application.toObject(), resume: req.file.filename });
    }
    return res.status(400).json({ error: 'Can not create application' });
}


async function getApplications(req, res) {
    try {
        if (req.user.role === 'admin') {
            const applications = await applicationModel.find();
            return res.status(200).json(applications);
        }
        if (req.user.role === 'employer') {
            
            return res.status(200).json(applications);

        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports = {
    addApplication,
    getApplications,
}