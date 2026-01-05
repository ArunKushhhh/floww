import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    // console.log("Env: ", JSON.stringify(environment, null, 4));
    const html = await environment.getPage()!.content();
    // console.log("Page HTML: ", html);
    environment.setOutput("HTML", html);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
