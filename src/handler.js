const { nanoid } = require('nanoid');
const books = require('./books');

/* ====================== Menyimpan Buku ====================== */

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Gagal menambahkan buku',
    })
    .code(500);
  return response;
};

/* ====================== Menampilkan Seluruh Buku ====================== */

const getAllBooksHandler = (request, h) => {
  const { query } = request;

  let filteredBooks = Array.from(books);

  if (query.name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(query.name.toLowerCase())
    );
  }

  if (query.reading === '0' || query.reading === '1') {
    const isReading = query.reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (query.finished === '0' || query.finished === '1') {
    const isFinished = query.finished === '1';
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished
    );
  }

  const response = h
    .response({
      status: 'success',
      data: {
        books: filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200);

  return response;
};

/* ====================== Menampilkan Detail Buku ====================== */

const getBookByIdHandler = (request, h) => {
  const { bookId: id } = request.params;

  const book = books.filter((item) => item.id === id)[0];

  if (book !== undefined) {
    return h
      .response({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
  return response;
};

/* ====================== Mengubah Data Buku ====================== */

const editBookByIdHandler = (request, h) => {
  const { bookId: id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
    return response;
  }
  const response = h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

/* ====================== Menghapus Data Buku ====================== */

const deleteBookByIdHandler = (request, h) => {
  const { bookId: id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
