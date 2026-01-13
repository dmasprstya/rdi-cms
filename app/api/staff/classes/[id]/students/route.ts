import { NextRequest, NextResponse } from 'next/server';
import { GET as GuruGetStudents } from '../../../../guru/classes/[classId]/students/route';

// Wrapper to map staff [id] param to guru [classId] param
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    // Map staff's [id] to guru's [classId]
    return GuruGetStudents(req, { params: { classId: params.id } });
}
