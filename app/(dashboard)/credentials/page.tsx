import { getCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import { Suspense } from "react";
import { CreateCredentialDialog } from "./_components/CreateCredentialDialog";
import { formatDistanceToNow } from "date-fns";
import { DeleteCredentialDialog } from "./_components/DeleteCredentialDialog";

export default function Credentials() {
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        <CreateCredentialDialog />
      </div>

      <div className="h-full py-6 space-y-8">
        <Alert>
          <ShieldIcon className="size-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            All information is securely encrypted, ensuring your data remains
            safe.
          </AlertDescription>
        </Alert>

        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  );
}

async function UserCredentials() {
  const credentials = await getCredentialsForUser();

  if (!credentials) {
    return <div>Something went wrong</div>;
  }

  if (credentials.length === 0) {
    return (
      <Card>
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="rounded-full w-20 h-20 flex items-center justify-center bg-accent">
            <ShieldOffIcon className="size-10 stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-medium text-base">No credentials created yet</p>
            <p className="text-muted-foreground text-sm">
              Click the button below to create your first credential
            </p>
          </div>
          <CreateCredentialDialog triggerText="Create your first credential" />
        </div>
      </Card>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {credentials.map((credential: (typeof credentials)[number]) => {
        const createdAt = formatDistanceToNow(credential.createdAt, {
          addSuffix: true,
        });
        return (
          <Card key={credential.id} className="flex flex-row justify-between items-center w-full p-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full flex items-center justify-center bg-primary/10 w-8 h-8">
                <LockKeyholeIcon className="size-4 stroke-primary" />
              </div>
              <div>
                <p className="font-medium text-base">{credential.name}</p>
                <p className="text-muted-foreground text-sm">{createdAt}</p>
              </div>
            </div>
            <DeleteCredentialDialog name={credential.name} />
          </Card>
        );
      })}
    </div>
  );
}
