import type { Actions } from './$types';
import { supabase } from '$lib/supabaseClient';

export const actions: Actions = {
  uploadLesson: async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get('title')?.toString() ?? '';
    const description = formData.get('description')?.toString() ?? '';
    const order_index = Number(formData.get('order_index')) || 1;
    const file = formData.get('file') as File | null;

    if (!title || !description || !file) {
      return { status: { type: 'error', message: 'All fields are required.' } };
    }

    try {
      // Detect file extension for content_type
      const ext = file.name.split('.').pop()?.toLowerCase();
      let content_type: 'text' | 'pdf' | 'video' | 'docx' = 'text';

      if (ext === 'pdf') content_type = 'pdf';
      else if (ext === 'mp4' || ext === 'mov') content_type = 'video';
      else if (ext === 'docx') content_type = 'docx';
      else content_type = 'text'; // fallback for inline text lessons

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('lessons')
        .upload(`teacher/${Date.now()}-${file.name}`, file);

      if (error) {
        return { status: { type: 'error', message: error.message } };
      }

      // Insert lesson metadata into Supabase DB
      const { error: insertError } = await supabase
        .from('lessons')
        .insert({
          title,
          description,
          order_index,
          content_type,
          content_url: data?.path ?? '',
          teacher_id: null, // TODO: replace with logged-in teacher ID
          published: false,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        return { status: { type: 'error', message: insertError.message } };
      }

      return { status: { type: 'success', message: 'Lesson uploaded successfully!' } };
    } catch {
      return { status: { type: 'error', message: 'Unexpected error during upload.' } };
    }
  }
};
