'use client';

import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Drawer } from '@/components/ui/drawer';
import { InlineEditableField } from '@/components/ui/inline-editable-field';
import { InlineEditableList } from '@/components/ui/inline-editable-list';
import { Modal } from '@/components/ui/modal';
import { useState } from 'react';

/**
 * Page-local demo plumbing for /kitchen-sink — the one deliberate
 * "fourteenth" 'use client' file, scoped entirely to this throwaway page and
 * deleted alongside it at the end of P11. Drawer/Modal/InlineEditableField/
 * InlineEditableList are themselves controlled, hook-free primitives; this
 * file is where the controlling state lives for the demo.
 */

export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer open={open} onOpenChange={setOpen} title="Evidence">
        <p style={{ color: 'var(--text-body)' }}>
          The 480px right-side drawer. Esc closes it; focus returns to the trigger on close.
        </p>
      </Drawer>
    </>
  );
}

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Discard and restart conversation?"
        description="This clears the conversation and the brief. Your original idea text is kept."
      >
        <div className="flex justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
            Discard
          </Button>
        </div>
      </Modal>
    </>
  );
}

export function InlineEditableFieldDemo() {
  const [value, setValue] = useState('SMS rebooking for dental clinics');
  const [draft, setDraft] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <InlineEditableField
      label="one_liner"
      value={isEditing ? draft : value}
      isEditing={isEditing}
      onStartEdit={() => {
        setDraft(value);
        setIsEditing(true);
      }}
      onChange={setDraft}
      onCommit={() => {
        setValue(draft);
        setIsEditing(false);
      }}
      onCancel={() => setIsEditing(false)}
    />
  );
}

export function InlineEditableListDemo() {
  const [items, setItems] = useState([
    'Clinics already use paper reminder cards',
    'No-shows cost roughly $200 per slot',
  ]);

  return (
    <InlineEditableList
      label="assumptions"
      items={items}
      onChangeItem={(index, value) =>
        setItems((current) => current.map((item, i) => (i === index ? value : item)))
      }
      onRemoveItem={(index) => setItems((current) => current.filter((_, i) => i !== index))}
      onAddItem={() => setItems((current) => [...current, ''])}
    />
  );
}

export function CopyButtonDemo() {
  return (
    <div className="flex items-center gap-6">
      <CopyButton
        getText={() => 'https://startup-validator.app/r/sms-rebooking-4f2a'}
        label="Copy link"
      />
      <CopyButton
        getText={() => '1. How many clinics have you spoken to?\n2. What do they use today?'}
        label="Copy script"
        variant="button"
      />
    </div>
  );
}
