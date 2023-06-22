import * as React from "react";
import { ListItemList } from "components/list-item-list";
import { Link } from "components/lib";

export function FinishedScreen() {
  return (
    <ListItemList
      filterListItems={(li) => Boolean(li.finishDate)}
      noListItems={
        <p>
          Hey there! This is where books will go when you're finished reading
          them. Get started by heading over to{" "}
          <Link to="/discover">the Discover page</Link> to add books to your
          list.
        </p>
      }
      noFilteredListItems={
        <p>
          Looks like you've got some reading to do! Check them out in your{" "}
          <Link to="/list">reading list</Link> or{" "}
          <Link to="/discover">discover more</Link>.
        </p>
      }
    />
  );
}
