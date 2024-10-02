// components/ListItem.tsx
import { FC } from 'react';
import { Button } from '@components/ui/button'; // Adjust import as needed

interface ListItemProps {
  list: { id: string; name: string; imageUrl?: string; bio: string };
  onClick: (listId: string) => void;
  onDelete: (listId: string) => void;
}

const ListItem: FC<ListItemProps> = ({ list, onClick, onDelete }) => {
  return (
    <li className="list-your-button" onClick={() => onClick(list.id)}>
      {list.name}
      {list.imageUrl && <img src={list.imageUrl} alt="List Image" className="w-16 h-16 object-cover rounded-full mt-2" />}
      <p className="text-sm text-gray-600 mt-2">{list.bio}</p>
      <Button
        onClick={(e) => {
          e.stopPropagation(); // Prevents the click from affecting the list item
          onDelete(list.id);
        }}
        className="delete-fassg2 ml-2 text-red-500 hover:text-red-700"
        aria-label="Delete List"
      >
        Delete
      </Button>
    </li>
  );
};

export default ListItem;
