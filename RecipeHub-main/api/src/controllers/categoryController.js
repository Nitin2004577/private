import categoryService from "../services/categoryService.js";

const createCategory = async (req, res) => {
  const input = req.body;

  try {
    const data = await categoryService.createCategory(
      req.params.id,
      req.file,
      input
    );

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export default { createCategory };
