import { useCallback } from 'react';
import { uuid } from '../articleUtils';
import TextBlock from './TextBlock';
import MediaBlockDisplay from './MediaBlockDisplay';
import AddBlockButton from './AddBlockButton';

export default function BlockEditor({ blocks, onChange }) {
  const addBlock = useCallback((afterIndex, preset = {}) => {
    const newBlock = {
      id: uuid(),
      type: 'text',
      content: '',
      url: '',
      alt: '',
      caption: '',
      mediaId: null,
      ...preset,
    };
    onChange(prev => {
      const next = [...prev];
      next.splice(afterIndex + 1, 0, newBlock);
      return next;
    });
  }, [onChange]);

  const updateBlock = useCallback((id, patch) => {
    onChange(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b));
  }, [onChange]);

  const removeBlock = useCallback((id) => {
    onChange(prev => {
      const next = prev.filter(b => b.id !== id);
      return next.length ? next : [{ id: uuid(), type: 'text', content: '' }];
    });
  }, [onChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {blocks.map((block, i) => (
        <div key={block.id}>
          {block.type === 'text' ? (
            <TextBlock
              block={block}
              onChange={patch => updateBlock(block.id, patch)}
              onRemove={() => removeBlock(block.id)}
              isOnly={blocks.length === 1}
            />
          ) : (
            <MediaBlockDisplay
              block={block}
              onChange={patch => updateBlock(block.id, patch)}
              onRemove={() => removeBlock(block.id)}
            />
          )}
          <AddBlockButton onAdd={preset => addBlock(i, preset)} />
        </div>
      ))}
    </div>
  );
}
