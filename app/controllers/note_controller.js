import Note from '../models/note_model';

export const createNote = (fields) => {
  const note = new Note(fields);
  return note.save();
};

export const getNotes = () => {
  return Note.find({}).then(notes => {
    return notes.reduce((result, item) => {
      result[item.id] = item;
      return result;
    }, {});
  });
};

export const deleteNote = (id) => {
  // to quote Prof. Cormen: left as an exercise to the reader
  // remember to return the mongoose function you use rather than just delete
  return Note.remove(id);
};

export const updateNote = (id, fields, done) => {
  // update the note and return the top level mongoose function you used, such as return Note.findById...
  return Note.findById(id).update(id, fields, done);
};
