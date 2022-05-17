import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface Customer {
  id: number;
  img: string;
  name: string;
  birthday: string;
  gender: string;
  job: string;
}

function App() {
  const [data, setData] = useState<Customer[]>();
  const url = "http://localhost:3000/api/customers";
  const { register, handleSubmit, setValue } = useForm<Customer>();
  const [ok, setOk] = useState(false);

  const upload = async (url: string, form: any, config: any) => {
    const { data } = await axios.post(url, form, config);
    setOk(data.ok);
  };

  const onValid = ({ gender, name, job, img, birthday }: Customer) => {
    const url = "http://localhost:3000/api/customers";
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    const form = new FormData();
    form.append("img", img[0]);
    form.append("gender", gender);
    form.append("name", name);
    form.append("job", job);
    form.append("birthday", birthday);
    upload(url, form, config);
    setValue("img", "");
    setValue("name", "");
    setValue("job", "");
    setValue("birthday", "");
  };

  useEffect(() => {
    (async () => {
      const posts = await axios.get<Customer[]>(url);
      setData(posts.data);
    })();
  }, []);

  useEffect(() => {
    if (ok) {
      (async () => {
        const posts = await axios.get<Customer[]>(url);
        setData(posts.data);
      })();
    }
  }, [ok]);

  return (
    <div className="App">
      {data &&
        data.map(el => (
          <div key={el.id} style={{ display: "flex", margin: "10px" }}>
            <div style={{ paddingLeft: "40px" }}>num - {el.id}</div>
            <div style={{ paddingLeft: "40px" }}>name - {el.name}</div>
            <div style={{ paddingLeft: "40px" }}>gender -{el.gender}</div>
            <div style={{ paddingLeft: "40px" }}>job - {el.job}</div>
            <div style={{ paddingLeft: "40px" }}>birthday - {el.birthday}</div>
            <img
              src={`http://localhost:3000${el.img}.jpeg`}
              style={{ paddingLeft: "40px" }}
              alt={el.img}
            ></img>
            <div> {el.img}</div>
          </div>
        ))}
      <form
        onSubmit={handleSubmit(onValid)}
        style={{ display: "flex", flexDirection: "column", width: "300px" }}
      >
        <label htmlFor="gender">Gender : </label>
        <input
          {...register("gender", { required: true })}
          id="gender"
          placeholder="gender"
        />
        <label htmlFor="name">Name : </label>
        <input
          {...register("name", { required: true })}
          id="name"
          placeholder="name"
        />
        <label htmlFor="job">Job : </label>
        <input
          {...register("job", { required: true })}
          id="job"
          placeholder="job"
        />
        <label htmlFor="birthday">BirthDay : </label>
        <input
          {...register("birthday", { required: true })}
          id="birthday"
          placeholder="birthday"
        />
        <label htmlFor="img">Image : </label>
        <input
          {...register("img", { required: true })}
          id="img"
          type="file"
          accept="image/*"
          placeholder="img"
        />
        <button>ADD</button>
      </form>
    </div>
  );
}

export default App;
