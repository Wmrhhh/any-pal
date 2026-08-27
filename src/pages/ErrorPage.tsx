import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  console.error("路由发生错误：", error);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">页面出现问题</h1>
        <p className="mt-2 text-gray-500">
          页面暂时无法正常加载，请稍后重试。
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg border px-4 py-2"
        >
          刷新页面
        </button>
      </div>
    </div>
  );
}