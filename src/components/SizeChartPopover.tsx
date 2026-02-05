import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SizeChartPopoverProps {
  children: React.ReactNode;
}

const sizeData = [
  { size: "XS", bust: "84-86", waist: "58-60", hips: "86-88" },
  { size: "S", bust: "88-90", waist: "62-64", hips: "90-94" },
  { size: "M", bust: "92-94", waist: "66-68", hips: "94-96" },
  { size: "L", bust: "96-98", waist: "70-72", hips: "98-100" },
  { size: "XL", bust: "98-100", waist: "74-76", hips: "102-104" },
];

const SizeChartPopover = ({ children }: SizeChartPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent 
        className="w-72 p-0 bg-background border border-border shadow-lg" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4">
          <h4 className="text-sm font-medium uppercase tracking-wider mb-3 text-center">
            Размерная сетка
          </h4>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-medium text-muted-foreground">Размер</th>
                <th className="py-2 text-center font-medium text-muted-foreground">Грудь</th>
                <th className="py-2 text-center font-medium text-muted-foreground">Талия</th>
                <th className="py-2 text-center font-medium text-muted-foreground">Бёдра</th>
              </tr>
            </thead>
            <tbody>
              {sizeData.map((row) => (
                <tr key={row.size} className="border-b border-border last:border-0">
                  <td className="py-2 font-medium">{row.size}</td>
                  <td className="py-2 text-center text-muted-foreground">{row.bust}</td>
                  <td className="py-2 text-center text-muted-foreground">{row.waist}</td>
                  <td className="py-2 text-center text-muted-foreground">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-muted-foreground mt-3 text-center">
            Все размеры указаны в сантиметрах
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SizeChartPopover;
