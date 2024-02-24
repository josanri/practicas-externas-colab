import Image from "next/image";
import Link from "next/link";
import clientPromise from "../../../lib/mongodb";
import ofertas from "../../../public/ofertas.json";

async function getServerSideProps() {
  // Fetch data from external API
  const mongodb = await clientPromise;
  const data = await mongodb.db("practicas").collection("preferences").find().toArray();
  // Pass data to the page via props
  return { data }
}


export default async function CurrentData() {
  const { data } = await getServerSideProps();
  
  data.sort((a, b) => a.rank - b.rank);
  for (let i = 0; i < data.length; i++) {
    data[i].rank = data[i].rank.toString();
    data[i].preferences = data[i].preferences.map((item: any) => {
      const oferta = ofertas.find((oferta: any) => oferta.id === item);
      if (!oferta) {
        return item;
      }
      return `${oferta.id} - ${oferta.enterprise} (${oferta.capacity})`;
    });
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-5xl font-bold">Datos actualizados</h1>
        <h2 className="text-2xl font-semibold mt-5">¿Quieres verificar tus datos?</h2>
        <p>Como no todo el mundo quiere mostrar su DNI al mundo (aunque la UMA lo haga), las preferencias están basadas en la confianza.</p>
        <p>Para añadir más confianza al asunto, es posible verificarlo si se contacta con el administrador.</p>
        <p>Este acto es voluntario, si bien a más gente lo realice, más valor tienen los datos.</p>
        <div className="flex items-center flex-wrap justify-center gap-2 mt-4">
          <a className="telegramLink flex flex-row" href={`https://t.me/${process.env.NEXT_PUBLIC_TLF}`}>
            <Image src="../telegram_logo.svg" alt="Telegram" width={20} height={20} className="w-6 h-6" /><span className="pl-2">Contacta por Telegram</span>
          </a>
          <a className="whatsappLink flex flex-row" href={`whatsapp://send?phone=${process.env.NEXT_PUBLIC_TLF}&abid=${process.env.NEXT_PUBLIC_TLF}`}>
            <Image src="/whatsapp_logo.svg" alt="WhatsApp" width={20} height={20} className="w-6 h-6" /><span className="pl-2">Contacta por WhatsApp Desktop</span>
          </a>
          <a className="whatsappLink flex flex-row" href={`http://web.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_TLF}&abid=${process.env.NEXT_PUBLIC_TLF}`}>
            <Image src="/whatsapp_logo.svg" alt="WhatsApp" width={20} height={20} className="w-6 h-6" /><span className="pl-2">Contacta por WhatsApp Web</span>
          </a>
        </div>
        <h2 className="text-2xl font-semibold mt-5">Datos</h2>
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-slate-400 ">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-slate-300">Puesto</th>
                <th className="border border-slate-300">Preferencias</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className={item.verified ? "verified" : ""}>
                  <td className="border border-slate-300">{item.rank}</td>
                  <td className="border border-slate-300">{item.preferences.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <p>* En verde se encuentran aquellas entradas que han sido verificadas.</p>
        </div>
        <div className="mb-32 mt-4 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
        <Link
          href="/preferences"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Añade tus preferencias{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Introduce tus preferencias de forma anónima.
          </p>
        </Link>
      </div>
    </main>
  );
}
