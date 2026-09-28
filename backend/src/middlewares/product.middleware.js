export const parseProductData = (req, res, next) => {
    try {
        if(req.body?.price && typeof req.body.price === "string") {
            req.body.price = JSON.parse(req.body.price);
        }

        if(req.body?.sizes && typeof req.body.sizes === "string") {
            req.body.sizes = JSON.parse(req.body.sizes);
        }

        if(req.body?.deletedImageIds && typeof req.body.deletedImageIds === "string") {
            try {
                req.body.deletedImageIds = JSON.parse(req.body.deletedImageIds);
            } catch (error) {
                // If sent as a single plain string (e.g. "file_id_1"), wrap it into an 
                req.body.deletedImageIds = [req.body.deletedImageIds];
            }
        }

        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid Product Data Format"
        })
    }
}