import { Form, InputGroup } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface TableSearchProps {
  onSearch: (query: string) => void;
}

export default function TableSearch({ onSearch }: TableSearchProps) {
  const [searchText, setSearchText] = useState("");
  const [searchQuery] = useDebounce(searchText, 300);

  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery]);

  return (
    <Form.Group controlId="formFile" className="col-sm-3 mb-3">
      <InputGroup>
        <InputGroup.Text id="search-icon">
          <FiSearch size={18} />
        </InputGroup.Text>
        <Form.Control
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search Table"
          type="text"
          aria-describedby="search-icon"
        />
      </InputGroup>
    </Form.Group>
  );
}
