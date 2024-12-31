import { useState } from "react";
import { Button } from "@nextui-org/button";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Input } from "@nextui-org/input";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";

import {
  addCompetitor,
  updateCompetitor,
  deleteCompetitor,
} from "@/reducers/race";
import DefaultLayout from "@/layouts/default";
import { boatClasses } from "@/boat-classes";

function BoatClassSelector({ value, onChange }) {
  const [selected, setSelected] = useState(value);

  return (
    <Autocomplete
      items={boatClasses}
      selectedKey={selected}
      onSelectionChange={(key) => {
        setSelected(key);
        onChange({ target: { value: key } });
      }}
    >
      {(boatClass) => (
        <AutocompleteItem key={boatClass.title}>
          {boatClass.title}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
  // TODO: Why doesnt this work?
  //<AutocompleteItem key={boatClass.title}>{boatClass.title} (py: {boatClass.yardstick})</AutocompleteItem>
}

function CompetitorInputTable() {
  const competitors = useSelector((state) => state.race.competitors);
  const dispatch = useDispatch();

  const _updateCompetitor = (competitor, field) => (e) => {
    dispatch(updateCompetitor({ ...competitor, [field]: e.target.value }));
  };

  return (
    <Table
      bottomContent={
        <Button color="primary" onPress={() => dispatch(addCompetitor({}))}>
          Add
        </Button>
      }
    >
      <TableHeader>
        <TableColumn>Helm</TableColumn>
        <TableColumn>Boat Class</TableColumn>
        <TableColumn>Sail Number</TableColumn>
        <TableColumn>Crew</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody items={competitors}>
        {(competitor) => (
          <TableRow key={competitor.id}>
            <TableCell>
              <Input
                value={competitor.name}
                onChange={_updateCompetitor(competitor, "name")}
              />
            </TableCell>
            <TableCell>
              <BoatClassSelector
                value={competitor.boatClass}
                onChange={_updateCompetitor(competitor, "boatClass")}
              />
            </TableCell>
            <TableCell>
              <Input
                value={competitor.sailNumber}
                onChange={_updateCompetitor(competitor, "sailNumber")}
              />
            </TableCell>
            <TableCell>
              <Input
                isClearable
                value={competitor.crew}
                onChange={_updateCompetitor(competitor, "crew")}
              />
            </TableCell>
            <TableCell>
              <Button
                color="danger"
                onPress={() => dispatch(deleteCompetitor(competitor))}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default function CompetitorsPage() {
  return (
    <DefaultLayout>
      <CompetitorInputTable />
    </DefaultLayout>
  );
}
