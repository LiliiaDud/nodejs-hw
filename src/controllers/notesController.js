import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;
    const skip = (page - 1) * perPage;

    const filter = {};
    if (tag) filter.tag = tag;
    if (search && search.trim() !== '') filter.$text = { $search: search };

    const notesQuery = Note.find(filter);
    const [totalNotes, notes] = await Promise.all([
      notesQuery.clone().countDocuments(),
      notesQuery.skip(skip).limit(perPage),
    ]);

    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      page,
      perPage,
      totalPages,
      totalNotes,
      notes,
    });
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);
    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }
    res.status(200).json(note);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(createHttpError(404, 'Note not found'));
    }
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndDelete({ _id: noteId });
    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }
    res.status(200).json(note);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(createHttpError(404, 'Note not found'));
    }
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
      new: true,
    });
    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }
    res.status(200).json(note);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(createHttpError(404, 'Note not found'));
    }
    next(err);
  }
};
