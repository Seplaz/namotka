import { useState } from 'react';
import { CornerRightUp } from 'lucide-react';
import { Input } from '@/components/Input/Input';
import { useToast } from '@/hooks/useToast';
import type { Comment } from '@/types/comment';
import styles from './Comments.module.css';

const MAX_COMMENT_LENGTH = 1000;

type CommentsProps = {
  comments?: Comment[];
  onAddComment: (content: string) => Promise<void>;
  canAddComment?: boolean;
};

export function Comments({
  comments = [],
  onAddComment,
  canAddComment = true,
}: CommentsProps) {
  const { showToast } = useToast();

  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const trimmedContent = content.trim();
  const hasContent = trimmedContent.length > 0;
  const isTooLong = trimmedContent.length > MAX_COMMENT_LENGTH;

  async function handleSubmit() {
    if (!hasContent || isTooLong || isSending) return;

    try {
      setIsSending(true);

      await onAddComment(trimmedContent);

      setContent('');
    } catch (error) {
      console.error('Не удалось отправить комментарий:', error);

      showToast({
        type: 'error',
        message: 'Не удалось отправить комментарий',
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className={styles.comments}>
      <div className={styles.heading}>
        <h3 className={styles.title}>Комментарии</h3>
        <span className={styles.count}>{comments.length}</span>
      </div>

      <div className={styles.list}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <article key={comment.id} className={styles.comment}>
              <div className={styles.commentMeta}>
                <span className={styles.author}>
                  {comment.authorName ?? 'Неизвестный пользователь'}
                </span>

                <time dateTime={comment.created_at}>
                  {new Date(comment.created_at).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>

              <p className={styles.commentText}>{comment.content}</p>
            </article>
          ))
        ) : (
          <p className={styles.empty}>Пока нет комментариев</p>
        )}
      </div>

      {canAddComment && (
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <Input
            className={styles.input}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Написать комментарий..."
            maxLength={MAX_COMMENT_LENGTH}
            disabled={isSending}
          />

          <button
            type="submit"
            className={styles.submit}
            disabled={!hasContent || isTooLong || isSending}
            aria-label="Отправить комментарий"
          >
            <CornerRightUp size={20} />
          </button>
        </form>
      )}
    </section>
  );
}
