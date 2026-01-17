import { Button, Form, InputGroup } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import { RxCross1 } from "react-icons/rx";

interface TableSearchProps {
  searchText: string;
  onSetSearchText: (text: string) => void;
  onSearch: (query: string) => void;
}

export default function TableSearch({ searchText, onSetSearchText, onSearch }: TableSearchProps) {
  const [searchQuery] = useDebounce(searchText, 300);

  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  return (
    <Form.Group controlId="formFile" className="col-sm-3 mb-3">
      <InputGroup>
        <InputGroup.Text id="search-icon">
          <FiSearch size={18} />
        </InputGroup.Text>
        <Form.Control
          onChange={(e) => onSetSearchText(e.target.value)}
          placeholder="Search Table"
          value={searchText}
          type="text"
          aria-describedby="search-icon"
        />
        {searchText && (
          <Button
            variant="outline-secondary"
            id="clear-search"
            onClick={() => {
              onSetSearchText("");
              onSearch("");
            }}
            style={{
              borderLeft: "none", // Merges visually with the input
              display: "flex",
              alignItems: "center",
            }}
          >
            <RxCross1 size={18} />
          </Button>
        )}
      </InputGroup>
    </Form.Group>
  );
}
