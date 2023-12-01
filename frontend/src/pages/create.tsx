import Header from "../components/Header";

const Create = () =>{
  return(
    <>
    <Header account={"1234"}/>
    <main className="max-w-screen-md mx-auto py-24">
      <h1 className="text-center font-bold py-8 text-2xl">New Post</h1>
      <form
        className="flex flex-col items-start px-20">
          <label htmlFor="title" className="mb-2">
          Title
        </label>
        <input
          id="title"
          className="w-full text-xl px-4 py-2 focus:outline-none focus:border-blue-300 border-2 rounded-md"
        />
        <label htmlFor="content" className="mt-4 mb-2">
          Content
        </label>
        <textarea
          id="content"
          className="w-full text-xl px-4 py-2 h-96 focus:outline-none focus:border-blue-300 border-2 rounded-md resize-none"
        />
        <input
          type="submit"
          value="Create"
          className="self-end mt-4 button-style"
        />
      </form>
    </main>
    </>
  );
};

export default Create;