import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Student {
    id: string;
    nis: string;
    phone: string | null;
    address: string | null;
    dateOfBirth: string | null;
    userName: string;
    userEmail: string;
    className: string | null;
}

interface Teacher {
    id: string;
    nip: string;
    subject: string | null;
    phone: string | null;
    dateOfBirth: string | null;
    userName: string;
    userEmail: string;
    classIds: string[];
}

/**
 * Generate PDF untuk data siswa
 * @param students - Array data siswa yang akan di-export
 */
export const generateStudentsPDF = (students: Student[]) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Data Siswa', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })}`, 14, 28);
    doc.text(`Total Siswa: ${students.length}`, 14, 34);

    // Table data
    const tableData = students.map((student, index) => [
        index + 1,
        student.nis,
        student.userName,
        student.userEmail,
        student.className || '-',
        student.phone || '-',
        student.dateOfBirth
            ? new Date(student.dateOfBirth).toLocaleDateString('id-ID')
            : '-'
    ]);

    autoTable(doc, {
        startY: 40,
        head: [['No', 'NIS', 'Nama', 'Email', 'Kelas', 'Telepon', 'Tanggal Lahir']],
        body: tableData,
        styles: {
            fontSize: 8,
            cellPadding: 2
        },
        headStyles: {
            fillColor: [59, 130, 246], // blue-500
            textColor: 255,
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251] // gray-50
        },
        columnStyles: {
            0: { cellWidth: 10 },  // No
            1: { cellWidth: 25 },  // NIS
            2: { cellWidth: 35 },  // Nama
            3: { cellWidth: 45 },  // Email
            4: { cellWidth: 20 },  // Kelas
            5: { cellWidth: 25 },  // Telepon
            6: { cellWidth: 30 }   // Tanggal Lahir
        },
        margin: { top: 40 }
    });

    // Footer dengan pagination
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
            `Halaman ${i} dari ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    // Generate filename dengan timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Data_Siswa_${timestamp}.pdf`;

    // Download PDF
    doc.save(filename);
};

/**
 * Generate PDF untuk data guru
 * @param teachers - Array data guru yang akan di-export
 */
export const generateTeachersPDF = (teachers: Teacher[]) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Data Guru', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })}`, 14, 28);
    doc.text(`Total Guru: ${teachers.length}`, 14, 34);

    // Table data
    const tableData = teachers.map((teacher, index) => [
        index + 1,
        teacher.nip,
        teacher.userName,
        teacher.userEmail,
        teacher.subject || '-',
        teacher.classIds?.length || 0,
        teacher.phone || '-'
    ]);

    autoTable(doc, {
        startY: 40,
        head: [['No', 'NIP', 'Nama', 'Email', 'Mata Pelajaran', 'Jml Kelas', 'Telepon']],
        body: tableData,
        styles: {
            fontSize: 8,
            cellPadding: 2
        },
        headStyles: {
            fillColor: [168, 85, 247], // purple-500
            textColor: 255,
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251] // gray-50
        },
        columnStyles: {
            0: { cellWidth: 10 },  // No
            1: { cellWidth: 25 },  // NIP
            2: { cellWidth: 40 },  // Nama
            3: { cellWidth: 50 },  // Email
            4: { cellWidth: 35 },  // Mata Pelajaran
            5: { cellWidth: 20 },  // Jumlah Kelas
            6: { cellWidth: 25 }   // Telepon
        },
        margin: { top: 40 }
    });

    // Footer dengan pagination
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
            `Halaman ${i} dari ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    // Generate filename dengan timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Data_Guru_${timestamp}.pdf`;

    // Download PDF
    doc.save(filename);
};
