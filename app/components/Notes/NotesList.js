import React from 'react';

// 'map': iterate through array and modify each item, and return new array with each item modified
const NotesList = ({notes}) => {
  return (
    <ul className="list-group">
      {notes.map((note, index) => (
        <li className="list-group-item" key={index}>{note}</li>
      ))}
    </ul>
  );
};

export default NotesList;
