import { People } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  people: Array<People>;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    people: await db.people.findMany(),
  };
  return json(data);
};

export default function Index() {
  let { people } = useLoaderData<LoaderData>();

  return (
    <main>
      <h1>People</h1>
      {people.length ? (
        <ul>
          {people.map((person) => (
            <li key={person.id}>
              {person.firstName} {person.lastName}
            </li>
          ))}
        </ul>
      ) : (
        <p>No people found</p>
      )}
    </main>
  );
}
