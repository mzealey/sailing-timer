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
import { Link } from "@nextui-org/link";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";

import {
  addCompetitor,
  updateCompetitor,
  deleteCompetitor,
} from "@/reducers/race";
import DefaultLayout from "@/layouts/default";
import { boatClasses } from "@/boat-classes";

function BoatClassSelector({ value, onChange, ...props }) {
  const [selected, setSelected] = useState(value);

  // Put selected class at the top of the list
  const order = selected ? [boatClasses.find(k => k.title === selected), ...boatClasses.filter(k => k.title !== selected)] : boatClasses;

  return (
    <Autocomplete
      items={order}
      isClearable={false}
      selectedKey={selected}
      isRequired
      onSelectionChange={(key) => {
        setSelected(key);
        onChange({ target: { value: key } });
      }}
      {...props}
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
    <>
      <Table>
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
                  className="min-w-32"
                  value={competitor.name}
                  onChange={_updateCompetitor(competitor, "name")}
                />
              </TableCell>
              <TableCell>
                <BoatClassSelector
                  className="min-w-40"
                  value={competitor.boatClass}
                  onChange={_updateCompetitor(competitor, "boatClass")}
                />
              </TableCell>
              <TableCell>
                <Input
                  className="min-w-16"
                  value={competitor.sailNumber}
                  onChange={_updateCompetitor(competitor, "sailNumber")}
                />
              </TableCell>
              <TableCell>
                <Input
                  isClearable
                  className="min-w-32"
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
      <div className="flex flex-row items-center">
        <Button
          className="flex-grow mx-2"
          color="primary"
          onPress={() => dispatch(addCompetitor({}))}
        >
          Add
        </Button>
        <Button
          as={Link}
          className="flex-grow mx-2"
          color="secondary"
          href="/race"
        >
          Start Race
        </Button>
      </div>
    </>
  );
}

export default function CompetitorsPage() {
  return (
    <DefaultLayout>
      <CompetitorInputTable />
    </DefaultLayout>
  );
}
