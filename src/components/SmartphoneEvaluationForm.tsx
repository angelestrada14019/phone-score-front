
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SmartphoneInput } from "../api/types/smartphone";
import { useToast } from "@/components/ui/use-toast";

interface SmartphoneEvaluationFormProps {
  onSubmit: (data: SmartphoneInput) => void;
  loading: boolean;
}

const SmartphoneEvaluationForm: React.FC<SmartphoneEvaluationFormProps> = ({ 
  onSubmit, 
  loading 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SmartphoneInput>({
    internal_storage: 128,
    storage_ram: 8,
    expandable_storage: "NA",
    primary_camera: "64MP + 12MP + 5MP",
    display: "Full HD+ AMOLED",
    network: "5G, 4G, 3G, 2G",
    battery: "4500 mAh"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert to number if the field is expected to be a number
    if (name === "internal_storage" || name === "storage_ram" || name === "battery") {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    if (name === "expandable_storage") {
      const expandableValue = value === "NA" ? "NA" : Number(value);
      setFormData(prev => ({ ...prev, [name]: expandableValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.internal_storage || !formData.storage_ram || !formData.primary_camera || !formData.battery) {
      toast({
        title: "Error en la validación",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
      <h3 className="text-xl font-bold mb-4">Evaluar Nuevo Smartphone</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="internal_storage">Almacenamiento Interno (GB)</Label>
          <Input
            id="internal_storage"
            name="internal_storage"
            type="number"
            value={formData.internal_storage}
            onChange={handleChange}
            min={16}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="storage_ram">RAM (GB)</Label>
          <Input
            id="storage_ram"
            name="storage_ram"
            type="number"
            value={formData.storage_ram}
            onChange={handleChange}
            min={1}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expandable_storage">Almacenamiento Expandible</Label>
          <Select 
            name="expandable_storage"
            value={formData.expandable_storage.toString()} 
            onValueChange={(value) => handleSelectChange(value, "expandable_storage")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NA">No Disponible</SelectItem>
              <SelectItem value="0.5">0.5 TB</SelectItem>
              <SelectItem value="1">1 TB</SelectItem>
              <SelectItem value="2">2 TB</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="primary_camera">Cámara Principal (ej: "64MP + 12MP")</Label>
          <Input
            id="primary_camera"
            name="primary_camera"
            value={formData.primary_camera}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="display">Pantalla</Label>
          <Select 
            name="display"
            value={formData.display} 
            onValueChange={(value) => handleSelectChange(value, "display")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tipo de pantalla" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LCD">LCD</SelectItem>
              <SelectItem value="LCDHD">LCD HD</SelectItem>
              <SelectItem value="Full HD+ AMOLED">Full HD+ AMOLED</SelectItem>
              <SelectItem value="Full HD+ Super AMOLED Plus">Full HD+ Super AMOLED Plus</SelectItem>
              <SelectItem value="Full HD+ Dynamic AMOLED 2X">Full HD+ Dynamic AMOLED 2X</SelectItem>
              <SelectItem value="QHD+ AMOLED">QHD+ AMOLED</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="network">Redes</Label>
          <Select 
            name="network"
            value={formData.network} 
            onValueChange={(value) => handleSelectChange(value, "network")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona redes compatibles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5G, 4G, 3G, 2G">5G, 4G, 3G, 2G</SelectItem>
              <SelectItem value="4G, 3G, 2G">4G, 3G, 2G</SelectItem>
              <SelectItem value="3G, 2G">3G, 2G</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="battery">Batería (mAh)</Label>
          <Input
            id="battery"
            name="battery"
            type="number"
            value={formData.battery}
            onChange={handleChange}
            min={1500}
            required
          />
        </div>
      </div>
      
      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Evaluando...
            </>
          ) : (
            "Evaluar Smartphone"
          )}
        </Button>
      </div>
    </form>
  );
};

export default SmartphoneEvaluationForm;
