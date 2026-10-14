export const authInput = "w-full border-0 border-b border-black/40 bg-transparent py-2 text-base outline-none transition placeholder:text-black/50 focus:border-brand";

export default function AuthShell({ children }) {
  return (
    <section className="mt-6 grid items-center sm:mt-10 lg:mt-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <img
        src="/images/auth-side.jpg"
        alt=""
        className="h-48 w-full object-cover sm:h-72 lg:h-[580px] lg:rounded-e"
      />
      <div className="px-4 py-10 sm:px-10 lg:px-[8vw] xl:px-[135px]">
        <div className="mx-auto w-full max-w-[371px] lg:mx-0">{children}</div>
      </div>
    </section>
  );
}
