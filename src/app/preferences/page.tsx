"use client"

import toast from "react-hot-toast";
import uploadPreferences from "../../../actions/uploadPreferences";
import ofertas from "../../../public/ofertas.json";
import Link from "next/link";

export default function CurrentData() {
  const preferences = [];
  for (let i = 0; i < 48; i++) {
    preferences.push(
      <div className="grid grid-cols-4" key={i}>
        <span className="text-gray-700 col-span-4 md:col-span-1">Preferencia {i + 1}:</span>
        <select className="col-span-4 md:col-span-3 mx-2 border p-1 w-100" name={`preference_${i + 1}`}>
          {ofertas.map((item, index) => (
            <option key={index} value={item.id} defaultValue={0}>
              {`${item.id} - ${item.enterprise}`}
            </option>
          ))}
        </select>
      </div>
    );
  }
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-5xl font-bold">Añade tus preferencias</h1>
        <p className="mt-4">Se entiende al dejar en vacío todas las opciones, esa persona seleccionó nada.</p>
        <form action={async (e) => 
        {
          const message = await uploadPreferences(e) as any
          if (message.success !== undefined) {
            toast.success(message.success)
          }
          else if (message.error !== undefined) {
            toast.error(message.error)
          }
        }}>
          <label htmlFor="rank" className="block mt-4">
            <span className="text-gray-700">Puesto</span>
            <input
              type="number"
              min={1}
              max={132}
              placeholder="123"
              id="rank"
              name="rank"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-700 focus:ring focus:ring-neutral-200 focus:ring-opacity-50"
              required
            />
          </label>
          <div className="mt-4">
            {preferences}
          </div>
          <input
            type="submit"
            className="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-neutral-600 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
            value="Enviar"
          />
        </form>
        <div className="mb-32 mt-4 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <Link
          href="/data"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Datos actuales{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Haz tus cuentas con datos verificados o no.
          </p>
        </Link>

        <Link
          href="https://github.com/josanri/practicas-externas-colab"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Repositorio en Github{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Si no te convence, aquí tienes el código.
          </p>
        </Link>
      </div>
      </div>
    </main>
  );
}
