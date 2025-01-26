import React from "react";

const TodoList = () => {
  return (
    <div className="todo bg-white p-6 rounded-lg shadow-md">
      <div className="head flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Todos</h3>
        <div className="flex space-x-2">
          <i className="bx bx-plus text-gray-600 text-xl"></i>
          <i className="bx bx-filter text-gray-600 text-xl"></i>
        </div>
      </div>
      <ul className="todo-list space-y-3">
        <li className="completed flex justify-between items-center">
          <p className="text-gray-600 line-through">Todo List 1</p>
          <i className="bx bx-dots-vertical-rounded text-gray-600"></i>
        </li>
        <li className="not-completed flex justify-between items-center">
          <p className="text-gray-600">Todo List 2</p>
          <i className="bx bx-dots-vertical-rounded text-gray-600"></i>
        </li>
        {/* Add more todos as needed */}
      </ul>
    </div>
  );
};

export default TodoList;
