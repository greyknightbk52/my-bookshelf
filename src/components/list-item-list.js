/** @jsx jsx*/
import { jsx } from "@emotion/react";
import { BookListUL } from "components/lib";
import { BookRow } from "components/book-row";
import { useListItems } from "utils/list-items";

function ListItemList({ filterListItems, noListItems, noFilteredListItems }) {
  const listItems = useListItems();
  const filteredListItems = listItems.filter(filterListItems);

  if (!listItems.length) {
    return (
      <div css={{ marginTop: "1em", fontSize: "1.2em" }}>{noListItems}</div>
    );
  }

  if (!filteredListItems.length) {
    return (
      <div css={{ marginTop: "1em", fontSize: "1.2em" }}>
        {noFilteredListItems}
      </div>
    );
  }

  return (
    <BookListUL>
      {filteredListItems.map((listItem) => (
        <li key={listItem.id} aria-label={listItem.book.title}>
          <BookRow book={listItem.book} />
        </li>
      ))}
    </BookListUL>
  );
}

export { ListItemList };
