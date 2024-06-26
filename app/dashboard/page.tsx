"use client";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Spacer,
} from "@nextui-org/react";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import { IoMdMail } from "react-icons/io";
import { ChipList } from "../../components/ChipList";
import { ActivityCard } from "../../components/activity";
import { useRecoilState } from "recoil";
import { resultState } from "../../components/recoil";
import { ActivityType } from "@/types/result";
import { useEffect, useState } from "react";

import axios from "axios";
import cheerio from "cheerio";

const getBook = async (keyword: String) => {
  try {
    const AXIOS_OPTIONS = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      },
    };
    const html = await axios.get(
      `https://search.kyobobook.co.kr/search?keyword=${keyword}&target=total&totalType=total&gbCode=TOT`,
      AXIOS_OPTIONS
    );

    const $ = cheerio.load(html.data);
    const list: String[] = [];
    $(".prod_list")
      .find("img")
      .each(function (i, el) {
        if (i < 3) {
          list.push(
            "https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/" +
              $(el).attr("data-kbbfn-bid")! +
              ".jpg"
          );
        }
      });

    return list;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default function DashboardPage() {
  const [result, setResult] = useRecoilState(resultState);
  const [index, setIndex] = useState(0);

  function changeIndex(delta: number) {
    setIndex(Math.min(Math.max(index + delta, 0), result.length - 1));
  }

  console.log(result[0]);

  if (!result[0].books) {
    result.forEach((value, index, array) => {});
  }

  return (
    <div className="grid gap-2 grid-cols-3 grid-rows-3 w-full h-[calc(100vh-65px)] max-h-[900px] p-4">
      <div className="flex flex-row row-span-3 gap-4">
        <div className="flex flex-col gap-4">
          <Major major={result[index].major} changeIndex={changeIndex} />
          <ChipList
            title="이 학과와 관련된 진로"
            list={result[index].careers}
          />
          <ChipList
            title="이 학과와 관련된 과목"
            list={result[index].subjects}
          />
        </div>
        <Divider orientation="vertical" />
      </div>
      <div className="flex flex-col row-span-2 col-span-2 px-2 gap-2">
        <Activity activities={result[index].activities} />
      </div>
      <div className="flex flex-col p-2 gap-2">
        <h1 className="text-xl font-bold">관련 도서 추천</h1>
        <div className="flex flex-grow flex-row gap-6">
          <Book />
          <Book />
          <Book />
        </div>
      </div>
      <div className="flex flex-col p-2 gap-2">
        <h1 className="text-xl font-bold">이 학과에 관심이 있나요?</h1>
        <div className="flex-grow flex flex-col justify-center items-center">
          <p>뉴스레터를 정기적으로 구독해보세요.</p>
          <Spacer y={2} />
          <Input
            type="email"
            placeholder="junior@example.com"
            className="max-w-[250px]"
            classNames={{
              input: ["group-data-[focus=true]:text-zinc-900"],
              inputWrapper: ["group-data-[focus=true]:bg-purple-100", "pr-0"],
            }}
            endContent={
              <Button isIconOnly className="bg-transparent">
                <IoMdMail className="text-2xl text-purple-400" />
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}

const Activity: React.FunctionComponent<{
  activities: ActivityType[];
}> = ({ activities }) => {
  const [activityPage, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [activities]);

  return (
    <>
      <div className="flex flex-row items-center">
        <h1 className="text-xl font-bold">후속 활동 추천</h1>
        <div className="grow" />
        <ButtonGroup>
          <Button
            isIconOnly
            className="bg-transparent"
            onClick={() => {
              setPage(Math.max(activityPage - 1, 0));
            }}
          >
            <BiSolidLeftArrow />
          </Button>
          <Button
            isIconOnly
            className="bg-transparent"
            onClick={() => {
              setPage(
                Math.min(activityPage + 1, (activities.length + 1) / 2 - 1)
              );
            }}
          >
            <BiSolidRightArrow />
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-grow flex-row gap-4">
        {activities
          .slice(
            activityPage * 2,
            Math.min((activityPage + 1) * 2, activities.length)
          )
          .map((value) => (
            <ActivityCard key={value.title} activity={value} />
          ))}
      </div>
    </>
  );
};

const Book = () => {
  return <div className="w-24 h-full bg-slate-300" />;
};

const Major: React.FunctionComponent<{
  major: {
    majorName: String;
    description: String;
  };
  changeIndex: (delta: number) => void;
}> = ({ major, changeIndex }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center">
        <h1 className="text-xl font-bold">학과 추천</h1>
        <div className="grow" />
        <ButtonGroup>
          <Button
            isIconOnly
            className="bg-transparent"
            onClick={() => changeIndex(-1)}
          >
            <BiSolidLeftArrow />
          </Button>
          <Button
            isIconOnly
            className="bg-transparent"
            onClick={() => changeIndex(1)}
          >
            <BiSolidRightArrow />
          </Button>
        </ButtonGroup>
      </div>
      <Card shadow="sm">
        <CardHeader className="dark:text-purple-300 bg-purple-100 dark:bg-default">
          {major.majorName}
        </CardHeader>
        <Divider />
        <CardBody>
          <p>{major.description}</p>
        </CardBody>
      </Card>
    </div>
  );
};
