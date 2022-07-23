import axios from "axios";
import { useEffect, useState } from "react";
import RoutainController from "./RoutainController";
import RoutainVisualizer from "./RoutainVisualizer";

export default function StatusBar() {
  const initialRunningAtom = {
    text: "-",
    duration: 0,
  };
  const initalRoutain = { name: "-" };

  const [routain, setRoutain] = useState(initalRoutain);
  const [atomList, setAtomList] = useState(null);
  const [runningAtomIndex, setRunningAtomIndex] = useState(0);
  const [runningAtom, setRunningAtom] = useState(initialRunningAtom);
  const [sec, setSec] = useState(0);

  useEffect(() => {
    async function getRoutain() {
      const res = await axios.get(
        process.env.REACT_APP_API_SERVER_DOMAIN + "/routain/get_is_use_routain",
        {
          headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem(
              "hoops-token"
            )}`,
          },
        }
      );

      if (res) {
        console.log(res);
        setRoutain(res.data.data.routain);
        setAtomList(res.data.data.routain_atom_list);
      }
    }

    getRoutain();
  }, []);

  const timer = {
    atomTimer: null,
    secTimer: null,
  };
  let t_sec = 0;

  const atomStart = (atomIndex) => {
    if (atomIndex < atomList.length) {
      // 실행 중 아톰 갱신
      setRunningAtomIndex(atomIndex);
      setRunningAtom(atomList[runningAtomIndex]);

      // 타이머 설정
      timer.atomTimer = setTimeout(() => {
        atomStart(atomIndex++);
      }, atomList[atomIndex].duration);
    }
  };
  const routainStart = () => {
    console.log("Routain start");

    if (atomList.length > 0) {
      atomStart(0);
      timer.secTimer = setInterval(function () {
        console.log(timerFlag);
        if (timerFlag) {
          setSec(t_sec + 1);
          t_sec++;
        }
      }, 1000);
    }
  };

  const routainStop = () => {
    console.log("Routain stopped");
    setTimerFlag(false);
    clearTimeout(timer.atomTimer);
    clearInterval(timer.secTimer);
    setRunningAtomIndex(0);
    setRunningAtom(initialRunningAtom);
  };

  const routainPause = () => {
    console.log("pause");
  };

  return (
    <div className="flex flex-wrap mb-2 px-6">
      <div className="text-sm font-bold leading-relaxed inline-block text-zinc-400">
        <span className="text-zinc-400">Routain : </span>
        {routain ? <span>{routain.name}</span> : <span>No use Routain.</span>}
      </div>
      {/* controller */}
      {routain ? (
        <RoutainController start={routainStart} stop={routainStop} />
      ) : (
        ""
      )}

      {routain ? (
        <RoutainVisualizer atom={runningAtom} second={sec / 60} />
      ) : (
        ""
      )}
    </div>
  );
}