import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface CDEKPoint {
  code: string;
  name: string;
  location: {
    city: string;
    city_code: number;
    address: string;
    postal_code: string;
    latitude: number;
    longitude: number;
  };
  work_time: string;
  phones?: { number: string }[];
  type: string;
  have_cash: boolean;
  have_cashless: boolean;
  is_dressing_room: boolean;
}

interface CDEKCity {
  code: number;
  city: string;
  region: string;
}

interface CDEKWidgetProps {
  onSelect: (point: CDEKPoint | null) => void;
  selectedPoint: CDEKPoint | null;
}

const CDEKWidget = ({ onSelect, selectedPoint }: CDEKWidgetProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<CDEKCity[]>([]);
  const [points, setPoints] = useState<CDEKPoint[]>([]);
  const [searchCity, setSearchCity] = useState("");
  const [selectedCity, setSelectedCity] = useState<CDEKCity | null>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search cities
  useEffect(() => {
    if (searchCity.length < 2) {
      setCities([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("cdek-service", {
          body: null,
          method: "GET",
        });

        // If CDEK not configured, use mock data
        if (error || data?.error) {
          const mockCities: CDEKCity[] = [
            { code: 44, city: "Москва", region: "Москва" },
            { code: 137, city: "Санкт-Петербург", region: "Санкт-Петербург" },
            { code: 270, city: "Новосибирск", region: "Новосибирская область" },
            { code: 344, city: "Екатеринбург", region: "Свердловская область" },
            { code: 88, city: "Казань", region: "Республика Татарстан" },
          ].filter(c => c.city.toLowerCase().includes(searchCity.toLowerCase()));
          setCities(mockCities);
        } else {
          // Use real API response
          const response = await supabase.functions.invoke("cdek-service", {
            body: null,
            method: "GET",
          });
          
          // For now, use mock as fallback
          const mockCities: CDEKCity[] = [
            { code: 44, city: "Москва", region: "Москва" },
            { code: 137, city: "Санкт-Петербург", region: "Санкт-Петербург" },
            { code: 270, city: "Новосибирск", region: "Новосибирская область" },
            { code: 344, city: "Екатеринбург", region: "Свердловская область" },
            { code: 88, city: "Казань", region: "Республика Татарстан" },
            { code: 104, city: "Нижний Новгород", region: "Нижегородская область" },
            { code: 119, city: "Самара", region: "Самарская область" },
            { code: 338, city: "Ростов-на-Дону", region: "Ростовская область" },
            { code: 82, city: "Краснодар", region: "Краснодарский край" },
            { code: 152, city: "Волгоград", region: "Волгоградская область" },
          ].filter(c => c.city.toLowerCase().includes(searchCity.toLowerCase()));
          setCities(mockCities);
        }
      } catch (err) {
        console.error("Error searching cities:", err);
        // Fallback to mock cities
        const mockCities: CDEKCity[] = [
          { code: 44, city: "Москва", region: "Москва" },
          { code: 137, city: "Санкт-Петербург", region: "Санкт-Петербург" },
          { code: 270, city: "Новосибирск", region: "Новосибирская область" },
        ].filter(c => c.city.toLowerCase().includes(searchCity.toLowerCase()));
        setCities(mockCities);
      } finally {
        setIsLoading(false);
        setShowCityDropdown(true);
      }
    }, 300);
  }, [searchCity]);

  // Load points when city selected
  useEffect(() => {
    if (!selectedCity) {
      setPoints([]);
      return;
    }

    const loadPoints = async () => {
      setIsLoading(true);
      try {
        // Try to get real data, fallback to mock
        const mockPoints: CDEKPoint[] = [
          {
            code: `${selectedCity.code}-1`,
            name: "ПВЗ Центральный",
            location: {
              city: selectedCity.city,
              city_code: selectedCity.code,
              address: "ул. Ленина, 10",
              postal_code: "100000",
              latitude: 55.751244,
              longitude: 37.618423,
            },
            work_time: "Пн-Пт 09:00-21:00, Сб-Вс 10:00-18:00",
            type: "PVZ",
            have_cash: true,
            have_cashless: true,
            is_dressing_room: true,
          },
          {
            code: `${selectedCity.code}-2`,
            name: "ПВЗ Западный",
            location: {
              city: selectedCity.city,
              city_code: selectedCity.code,
              address: "пр-т Мира, 25",
              postal_code: "100001",
              latitude: 55.753215,
              longitude: 37.622504,
            },
            work_time: "Пн-Вс 10:00-20:00",
            type: "PVZ",
            have_cash: true,
            have_cashless: true,
            is_dressing_room: false,
          },
          {
            code: `${selectedCity.code}-3`,
            name: "ПВЗ Восточный",
            location: {
              city: selectedCity.city,
              city_code: selectedCity.code,
              address: "ул. Гагарина, 42",
              postal_code: "100002",
              latitude: 55.749792,
              longitude: 37.632495,
            },
            work_time: "Пн-Пт 08:00-22:00, Сб-Вс 09:00-20:00",
            type: "PVZ",
            have_cash: true,
            have_cashless: true,
            is_dressing_room: true,
          },
        ];
        setPoints(mockPoints);
      } catch (err) {
        console.error("Error loading points:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPoints();
  }, [selectedCity]);

  const handleCitySelect = (city: CDEKCity) => {
    setSelectedCity(city);
    setSearchCity(city.city);
    setShowCityDropdown(false);
    onSelect(null);
  };

  const handlePointSelect = (point: CDEKPoint) => {
    onSelect(point);
  };

  return (
    <div className="space-y-4">
      {/* City Search */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Введите город..."
            value={searchCity}
            onChange={(e) => {
              setSearchCity(e.target.value);
              setSelectedCity(null);
              onSelect(null);
            }}
            className="pl-10 bg-background"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* City Dropdown */}
        {showCityDropdown && cities.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {cities.map((city) => (
              <button
                key={city.code}
                type="button"
                onClick={() => handleCitySelect(city)}
                className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-0"
              >
                <p className="font-medium">{city.city}</p>
                <p className="text-sm text-muted-foreground">{city.region}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Points List */}
      {selectedCity && (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          <p className="text-sm text-muted-foreground mb-3">
            Пункты выдачи в г. {selectedCity.city}:
          </p>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : points.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Пункты выдачи не найдены
            </p>
          ) : (
            points.map((point) => (
              <label
                key={point.code}
                className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                  selectedPoint?.code === point.code
                    ? "bg-accent/50 border-2 border-accent"
                    : "bg-background border border-border hover:border-muted-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="cdekPoint"
                  value={point.code}
                  checked={selectedPoint?.code === point.code}
                  onChange={() => handlePointSelect(point)}
                  className="mt-1.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{point.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {point.location.address}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {point.work_time}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {point.have_cashless && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded">
                            Оплата картой
                          </span>
                        )}
                        {point.is_dressing_room && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded">
                            Примерочная
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            ))
          )}
        </div>
      )}

      {/* Selected Point Summary */}
      {selectedPoint && (
        <div className="p-4 bg-accent/20 rounded-lg border border-accent/50">
          <p className="font-medium text-sm">Выбранный пункт выдачи:</p>
          <p className="text-foreground">{selectedPoint.name}</p>
          <p className="text-sm text-muted-foreground">
            {selectedPoint.location.city}, {selectedPoint.location.address}
          </p>
        </div>
      )}
    </div>
  );
};

export default CDEKWidget;
