import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';
import type { Comment } from '@/types/comment';

const COMMENT_SELECT = `
  id,
  task_id,
  content,
  created_at,
  created_by,
  author:profiles!comments_created_by_fkey(first_name, last_name)
`;

type CommentRow = Pick<
  Tables<'comments'>,
  'id' | 'task_id' | 'content' | 'created_at' | 'created_by'
> & {
  author: {
    first_name: string | null;
    last_name: string | null;
  } | null;
};

const MAX_COMMENT_LENGTH = 1000;

function mapCommentToComment(comment: CommentRow): Comment {
  const authorName = [comment.author?.first_name, comment.author?.last_name]
    .filter(Boolean)
    .join(' ');

  return {
    id: comment.id,
    task_id: comment.task_id,
    content: comment.content,
    created_at: comment.created_at,
    created_by: comment.created_by,
    authorName: authorName || null,
  };
}

export async function getComments(): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_SELECT)
    .order('created_at', { ascending: true })
    .order('id', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((comment) =>
    mapCommentToComment(comment as CommentRow),
  );
}

export async function createComment(
  taskId: string,
  content: string,
): Promise<Comment> {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    throw new Error('Комментарий не может быть пустым.');
  }

  if (trimmedContent.length > MAX_COMMENT_LENGTH) {
    throw new Error(
      `Комментарий не может быть длиннее ${MAX_COMMENT_LENGTH} символов.`,
    );
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      task_id: taskId,
      content: trimmedContent,
    })
    .select(COMMENT_SELECT)
    .single();

  if (error) throw error;

  return mapCommentToComment(data as CommentRow);
}
