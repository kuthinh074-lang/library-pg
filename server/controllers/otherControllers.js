const { Op, fn, col, literal } = require('sequelize');
const { Category, User, Fine, Reservation, Book, Borrow } = require('../models');

// ─── Category ───────────────────────────────────────────────────────────────
exports.getCategories = async (req, res) => {
  try {
    const cats = await Category.findAll({ where: { is_active: true }, order: [['name','ASC']] });
    res.json({ success: true, data: cats });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
exports.createCategory = async (req, res) => {
  try {
    const c = await Category.create(req.body);
    res.status(201).json({ success: true, data: c });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
exports.updateCategory = async (req, res) => {
  try {
    const c = await Category.findByPk(req.params.id);
    if (!c) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    await c.update(req.body);
    res.json({ success: true, data: c });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
exports.deleteCategory = async (req, res) => {
  try {
    const c = await Category.findByPk(req.params.id);
    if (!c) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    await c.update({ is_active: false });
    res.json({ success: true, message: 'Đã xóa' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.uploadCategoryPdf = async (req, res) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Không có file PDF' });

    const pdf_url = `/uploads/pdfs/${req.file.filename}`;
    const is_public_pdf = req.body.is_public_pdf === 'true';
    await cat.update({ pdf_url, is_public_pdf });
    res.json({ success: true, data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCategoryPdf = async (req, res) => {
  const fs   = require('fs');
  const path = require('path');
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    if (cat.pdf_url) {
      const filePath = path.join(__dirname, '..', cat.pdf_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await cat.update({ pdf_url: null, is_public_pdf: false });
    res.json({ success: true, message: 'Đã xóa PDF danh mục' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── User ────────────────────────────────────────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const where = {};
    if (role) where.role = role;
    if (search) where[Op.or] = [
      { name:       { [Op.iLike]: `%${search}%` } },
      { email:      { [Op.iLike]: `%${search}%` } },
      { student_id: { [Op.iLike]: `%${search}%` } },
    ];
    const { count, rows } = await User.findAndCountAll({
      where, order: [['created_at','DESC']],
      limit: parseInt(limit), offset: (parseInt(page)-1)*parseInt(limit),
    });
    res.json({ success: true, data: rows, total: count, page: parseInt(page), pages: Math.ceil(count/limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
exports.getUser = async (req, res) => {
  try {
    const u = await User.findByPk(req.params.id);
    if (!u) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.json({ success: true, data: u });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
exports.updateUser = async (req, res) => {
  try {
    const u = await User.findByPk(req.params.id);
    if (!u) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    const { name, phone, address, student_id, role, is_active, permissions } = req.body;
    await u.update({ name, phone, address, student_id, role, is_active,
      permissions: Array.isArray(permissions) ? permissions : [] });
    res.json({ success: true, data: u });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    await req.user.update({ name, phone, address });
    res.json({ success: true, data: req.user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── Fine ────────────────────────────────────────────────────────────────────
exports.getFines = async (req, res) => {
  try {
    const { isPaid, user_id, page = 1, limit = 20 } = req.query;
    const where = {};
    if (isPaid !== undefined) where.is_paid = isPaid === 'true';
    if (user_id) where.user_id = user_id;
    if (req.user.role === 'user') where.user_id = req.user.id;

    const { count, rows } = await Fine.findAndCountAll({
      where,
      include: [
        { model: User,   as: 'user',   attributes: ['id','name','email','student_id'] },
        { model: Borrow, as: 'borrow', include: [{ model: Book, as: 'book', attributes: ['id','title','author'] }] },
      ],
      order: [['created_at','DESC']],
      limit: parseInt(limit), offset: (parseInt(page)-1)*parseInt(limit),
    });
    res.json({ success: true, data: rows, total: count, page: parseInt(page), pages: Math.ceil(count/limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
exports.payFine = async (req, res) => {
  try {
    const fine = await Fine.findByPk(req.params.id);
    if (!fine) return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu phạt' });
    if (fine.is_paid) return res.status(400).json({ success: false, message: 'Đã thanh toán rồi' });
    await fine.update({ is_paid: true, paid_date: new Date(), paid_by: req.user.id });
    await User.decrement({ unpaid_fines: fine.amount }, { where: { id: fine.user_id } });
    res.json({ success: true, data: fine, message: 'Thanh toán thành công' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
exports.getMyFines = async (req, res) => {
  try {
    const fines = await Fine.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Borrow, as: 'borrow', include: [{ model: Book, as: 'book', attributes: ['id','title','author'] }] }],
      order: [['created_at','DESC']],
    });
    res.json({ success: true, data: fines });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── Reservation ─────────────────────────────────────────────────────────────
exports.reserve = async (req, res) => {
  try {
    const { book_id } = req.body;
    const book = await Book.findByPk(book_id);
    if (!book) return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
    if (book.available_copies > 0) return res.status(400).json({ success: false, message: 'Sách còn sẵn, hãy mượn trực tiếp' });
    const existing = await Reservation.findOne({ where: { user_id: req.user.id, book_id, status: 'pending' } });
    if (existing) return res.status(400).json({ success: false, message: 'Đã đặt trước cuốn sách này' });
    const r = await Reservation.create({ user_id: req.user.id, book_id });
    res.status(201).json({ success: true, data: r });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
exports.getMyReservations = async (req, res) => {
  try {
    const rs = await Reservation.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Book, as: 'book', attributes: ['id','title','author','cover'] }],
      order: [['created_at','DESC']],
    });
    res.json({ success: true, data: rs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
exports.cancelReservation = async (req, res) => {
  try {
    const r = await Reservation.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!r) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    await r.update({ status: 'cancelled' });
    res.json({ success: true, data: r });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── Stats ────────────────────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalBooks, totalUsers, activeBorrows, overdueBorrows, fineStats, unpaidStats, recentBorrows, popularBooks] = await Promise.all([
      Book.count({ where: { is_active: true } }),
      User.count({ where: { role: 'user' } }),
      Borrow.count({ where: { status: { [Op.in]: ['borrowed','renewed'] } } }),
      Borrow.count({ where: { status: 'overdue' } }),
      Fine.sum('amount'),
      Fine.sum('amount', { where: { is_paid: false } }),
      Borrow.findAll({
        limit: 10, order: [['created_at','DESC']],
        include: [
          { model: Book, as: 'book', attributes: ['id','title'] },
          { model: User, as: 'user', attributes: ['id','name','student_id'] },
        ],
      }),
      Book.findAll({ order: [['borrow_count','DESC']], limit: 5, attributes: ['id','title','author','borrow_count','cover'] }),
    ]);

    res.json({ success: true, data: {
      totalBooks, totalUsers, activeBorrows, overdueBorrows,
      totalFines: fineStats || 0,
      unpaidFines: unpaidStats || 0,
      recentBorrows, popularBooks,
    }});
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getBorrowStats = async (req, res) => {
  try {
    const monthly = await Borrow.findAll({
      attributes: [
        [fn('EXTRACT', literal('YEAR FROM created_at')),  'year'],
        [fn('EXTRACT', literal('MONTH FROM created_at')), 'month'],
        [fn('COUNT', col('id')), 'count'],
      ],
      where: { created_at: { [Op.gte]: new Date(new Date().getFullYear(), 0, 1) } },
      group: ['year', 'month'],
      order: [['year','ASC'], ['month','ASC']],
      raw: true,
    });
    res.json({ success: true, data: monthly });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── Thống kê mượn sách hàng ngày ────────────────────────────────────────────
exports.getDailyReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const start = from ? new Date(from) : new Date(new Date() - 30 * 86400000);
    const end   = to   ? new Date(to + 'T23:59:59') : new Date();

    const [borrows, returns_, newBorrows, overdue, finesCollected, librarianStats] = await Promise.all([
      Borrow.findAll({
        attributes: [
          [fn('DATE', col('borrow_date')), 'date'],
          [fn('COUNT', col('Borrow.id')), 'count'],
        ],
        where: { borrow_date: { [Op.between]: [start, end] } },
        group: [fn('DATE', col('borrow_date'))],
        order: [[fn('DATE', col('borrow_date')), 'ASC']],
        raw: true,
      }),
      Borrow.findAll({
        attributes: [
          [fn('DATE', col('return_date')), 'date'],
          [fn('COUNT', col('Borrow.id')), 'count'],
        ],
        where: { return_date: { [Op.between]: [start, end] }, status: 'returned' },
        group: [fn('DATE', col('return_date'))],
        order: [[fn('DATE', col('return_date')), 'ASC']],
        raw: true,
      }),
      Borrow.findAll({
        where: { borrow_date: { [Op.between]: [start, end] } },
        include: [
          { model: Book, as: 'book', attributes: ['id','title','author'] },
          { model: User, as: 'user', attributes: ['id','name','student_id','email'] },
        ],
        order: [['borrow_date','DESC']],
        limit: 500,
      }),
      Borrow.count({ where: { status: 'overdue' } }),
      Fine.sum('amount', {
        where: { is_paid: true, paid_date: { [Op.between]: [start, end] } },
      }),
      Borrow.findAll({
        attributes: [
          'processed_by',
          [fn('COUNT', col('Borrow.id')), 'borrow_count'],
        ],
        where: { borrow_date: { [Op.between]: [start, end] } },
        include: [
          { model: User, as: 'processor', attributes: ['id','name'] },
        ],
        group: ['processed_by', 'processor.id', 'processor.name'],
        order: [[fn('COUNT', col('Borrow.id')), 'DESC']],
        raw: false,
      }),
    ]);

    const dateMap = {};
    borrows.forEach(r => {
      if (!r.date) return;
      dateMap[r.date] = { date: r.date, borrowed: Number(r.count), returned: 0 };
    });
    returns_.forEach(r => {
      if (!r.date) return;
      if (!dateMap[r.date]) dateMap[r.date] = { date: r.date, borrowed: 0, returned: 0 };
      dateMap[r.date].returned = Number(r.count);
    });
    const dailyData = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));

    const processedLibrarianStats = librarianStats.map(s => ({
      processed_by: s.processed_by,
      borrow_count: Number(s.get('borrow_count') || 0),
      'processor.name': s.processor?.name || 'N/A',
    }));

    res.json({
      success: true,
      data: {
        dailyData,
        borrows: newBorrows,
        overdue,
        finesCollected: finesCollected || 0,
        totalBorrowed: borrows.reduce((sum, r) => sum + Number(r.count || 0), 0),
        totalReturned: returns_.reduce((sum, r) => sum + Number(r.count || 0), 0),
        librarianStats: processedLibrarianStats,
        from: start, to: end,
      },
    });
  } catch (err) {
    console.error('getDailyReport error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Xuất Excel báo cáo hàng ngày ───────────────────────────────────────────
exports.exportDailyReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const start = from ? new Date(from) : new Date(new Date() - 30 * 86400000);
    const end   = to   ? new Date(to + 'T23:59:59') : new Date();

    const borrows = await Borrow.findAll({
      where: { borrow_date: { [Op.between]: [start, end] } },
      include: [
        { model: Book, as: 'book', attributes: ['id','title','author','isbn'] },
        { model: User, as: 'user', attributes: ['id','name','student_id','email','phone'] },
      ],
      order: [['borrow_date','ASC']],
    });

    const ExcelJS = require('exceljs');
    const workbook  = new ExcelJS.Workbook();
    workbook.creator = 'Library Management System';
    workbook.created = new Date();

    // ── Sheet 1: Chi tiết phiếu mượn ──
    const ws1 = workbook.addWorksheet('Chi tiết mượn trả');
    ws1.columns = [
      { header: 'STT',           key: 'stt',         width: 6  },
      { header: 'Ngày mượn',     key: 'borrow_date', width: 14 },
      { header: 'Hạn trả',       key: 'due_date',    width: 14 },
      { header: 'Ngày trả',      key: 'return_date', width: 14 },
      { header: 'Tên sách',      key: 'book',        width: 36 },
      { header: 'Tác giả',       key: 'author',      width: 22 },
      { header: 'ISBN',          key: 'isbn',        width: 16 },
      { header: 'Người mượn',    key: 'user',        width: 22 },
      { header: 'Mã SV',         key: 'student_id',  width: 14 },
      { header: 'Email',         key: 'email',       width: 26 },
      { header: 'Trạng thái',    key: 'status',      width: 14 },
    ];

    const hStyle = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } },
      font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 },
      alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
      border: { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} },
    };
    ws1.getRow(1).eachCell(c => Object.assign(c, hStyle));
    ws1.getRow(1).height = 28;

    const statusLabel = { borrowed:'Đang mượn', returned:'Đã trả', overdue:'Quá hạn', renewed:'Gia hạn', lost:'Mất sách' };
    const statusColor = { borrowed:'FF16A34A', returned:'FF2563EB', overdue:'FFDC2626', renewed:'FF0891B2', lost:'FF6B7280' };

    borrows.forEach((b, idx) => {
      const row = ws1.addRow({
        stt:         idx + 1,
        borrow_date: b.borrow_date ? new Date(b.borrow_date).toLocaleDateString('vi-VN') : '',
        due_date:    b.due_date    ? new Date(b.due_date).toLocaleDateString('vi-VN')    : '',
        return_date: b.return_date ? new Date(b.return_date).toLocaleDateString('vi-VN') : '—',
        book:        b.book?.title  || '',
        author:      b.book?.author || '',
        isbn:        b.book?.isbn   || '',
        user:        b.user?.name   || '',
        student_id:  b.user?.student_id || '',
        email:       b.user?.email  || '',
        status:      statusLabel[b.status] || b.status,
      });
      row.height = 22;
      const fill = { type:'pattern', pattern:'solid', fgColor:{ argb: idx%2===0?'FFF8FAFC':'FFFFFFFF' } };
      const border = { top:{style:'thin',color:{argb:'FFE2E8F0'}}, left:{style:'thin',color:{argb:'FFE2E8F0'}}, bottom:{style:'thin',color:{argb:'FFE2E8F0'}}, right:{style:'thin',color:{argb:'FFE2E8F0'}} };
      row.eachCell(c => { c.fill = fill; c.border = border; c.alignment = { vertical:'middle', wrapText:true }; });
      // Màu trạng thái
      const statusCell = row.getCell('status');
      statusCell.font = { bold:true, color:{ argb: statusColor[b.status] || 'FF374151' } };
    });

    // ── Sheet 2: Tổng hợp theo ngày ──
    const ws2 = workbook.addWorksheet('Tổng hợp theo ngày');
    ws2.columns = [
      { header: 'Ngày',       key: 'date',     width: 14 },
      { header: 'Số mượn',    key: 'borrowed', width: 12 },
      { header: 'Số trả',     key: 'returned', width: 12 },
    ];
    ws2.getRow(1).eachCell(c => Object.assign(c, hStyle));

    // Gộp theo ngày
    const dayMap = {};
    borrows.forEach(b => {
      const d = b.borrow_date ? new Date(b.borrow_date).toLocaleDateString('vi-VN') : '';
      if (!dayMap[d]) dayMap[d] = { date: d, borrowed: 0, returned: 0 };
      dayMap[d].borrowed++;
    });
    borrows.filter(b => b.status === 'returned' && b.return_date).forEach(b => {
      const d = new Date(b.return_date).toLocaleDateString('vi-VN');
      if (!dayMap[d]) dayMap[d] = { date: d, borrowed: 0, returned: 0 };
      dayMap[d].returned++;
    });
    Object.values(dayMap).forEach((row, i) => {
      const r = ws2.addRow(row);
      r.height = 22;
      r.eachCell(c => {
        c.fill = { type:'pattern', pattern:'solid', fgColor:{ argb: i%2===0?'FFF8FAFC':'FFFFFFFF' } };
        c.alignment = { horizontal:'center', vertical:'middle' };
        c.border = { top:{style:'thin',color:{argb:'FFE2E8F0'}}, left:{style:'thin',color:{argb:'FFE2E8F0'}}, bottom:{style:'thin',color:{argb:'FFE2E8F0'}}, right:{style:'thin',color:{argb:'FFE2E8F0'}} };
      });
    });
    // ── Sheet 3: Thống kê theo thủ thư ──
    const ws3 = workbook.addWorksheet('Thống kê thủ thư');
    ws3.columns = [
      { header: 'Tên thủ thư', key: 'librarian', width: 22 },
      { header: 'Số lượt cho mượn', key: 'borrow_count', width: 18 },
    ];
    ws3.getRow(1).eachCell(c => Object.assign(c, hStyle));

    // Lấy thống kê thủ thư
    const librarianStats = await Borrow.findAll({
      attributes: [
        'processed_by',
        [fn('COUNT', col('Borrow.id')), 'borrow_count'],
      ],
      where: { borrow_date: { [Op.between]: [start, end] } },
      include: [
        { model: User, as: 'processor', attributes: ['id','name'] },
      ],
      group: ['processed_by', 'processor.id', 'processor.name'],
      order: [[fn('COUNT', col('Borrow.id')), 'DESC']],
      raw: false,
    });

    const processedStats = librarianStats.map(s => ({
      processed_by: s.processed_by,
      borrow_count: s.dataValues.borrow_count,
      'processor.name': s.processor?.name || 'N/A'
    }));

    processedStats.forEach((l, i) => {
      const r = ws3.addRow({
        librarian: l['processor.name'] || 'N/A',
        borrow_count: Number(l.borrow_count),
      });
      r.height = 22;
      r.eachCell(c => {
        c.fill = { type:'pattern', pattern:'solid', fgColor:{ argb: i%2===0?'FFF8FAFC':'FFFFFFFF' } };
        c.alignment = { horizontal:'left', vertical:'middle' };
        c.border = { top:{style:'thin',color:{argb:'FFE2E8F0'}}, left:{style:'thin',color:{argb:'FFE2E8F0'}}, bottom:{style:'thin',color:{argb:'FFE2E8F0'}}, right:{style:'thin',color:{argb:'FFE2E8F0'}} };
      });
    });
    const fname = `baocao-muon-sach-${from||'30ngay'}-den-${to||'homay'}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fname)}`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) { console.error('exportDailyReport error:', err); res.status(500).json({ success: false, message: err.message }); }
};