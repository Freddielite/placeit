import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function Welcome({
  open,
  onClose,
  status,
}: {
  open: boolean;
  onClose: () => void;
  status?: string;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-md rounded-lg bg-accent p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo />

          <div className="inline-flex items-center rounded-full bg-background/70 px-3 py-1 text-xs font-medium text-primary">
            {status}
          </div>

          <h1 className="text-2xl font-bold text-primary">
            Welcome to your dashboard
          </h1>

          <p className="text-sm text-muted-foreground">
            Your account is under review. We’ll email you once it’s approved.
            Meanwhile, you can explore resources and get familiar with the
            platform.
          </p>

          <div className="mt-2 flex w-full gap-2">
            {/* <Button
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button> */}

            <Button className="w-full" onClick={onClose}>
              Explore resources
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
