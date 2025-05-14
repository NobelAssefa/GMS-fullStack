const AsyncHandler = require('express-async-handler');
const cloudinary = require('../Utils/cloudinary');
const { Readable } = require('stream');

const bufferToStream = (buffer) => {
    return new Readable({
        read() {
            this.push(buffer);
            this.push(null);
        }
    });
};

const uploadImage = AsyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    try {
        // Create a stream from the buffer
        const stream = bufferToStream(req.file.buffer);

        // Upload to Cloudinary using stream
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'user_profiles',
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            stream.pipe(uploadStream);
        });

        const result = await uploadPromise;
        res.status(200).json({ url: result.secure_url });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500);
        throw new Error('Failed to upload image to Cloudinary');
    }
});

module.exports = {
    uploadImage
}; 