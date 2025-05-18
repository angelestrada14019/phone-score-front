
import React, { useState, useEffect } from "react";
import { evaluateSmartphone, getSampleSmartphones } from "@/api";
import { SmartphoneEvaluation, SmartphoneInput } from "@/api/types/smartphone";
import SmartphoneCard from "@/components/SmartphoneCard";
import SmartphoneEvaluationForm from "@/components/SmartphoneEvaluationForm";
import DashboardHeader from "@/components/DashboardHeader";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [evaluations, setEvaluations] = useState<SmartphoneEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluatingNew, setEvaluatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState("devices");

  // Load initial evaluations
  useEffect(() => {
    const loadInitialEvaluations = async () => {
      try {
        setLoading(true);
        
        // Get sample smartphones from API
        const samples = await getSampleSmartphones();
        
        // Process each sample smartphone and get evaluations
        const evaluationPromises = samples.map((smartphone) => 
          evaluateSmartphone(smartphone)
        );
        
        const results = await Promise.all(evaluationPromises);
        setEvaluations(results);
      } catch (error) {
        console.error("Error loading initial evaluations:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las evaluaciones iniciales. Utilizando datos de ejemplo.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialEvaluations();
  }, []);

  // Handle new smartphone evaluation submission
  const handleEvaluateNewSmartphone = async (data: SmartphoneInput) => {
    try {
      setEvaluatingNew(true);
      
      // Call API to evaluate the smartphone
      const evaluation = await evaluateSmartphone(data);
      
      // Add to the list of evaluations
      setEvaluations((prev) => [evaluation, ...prev]);
      
      toast({
        title: "Evaluación completada",
        description: "El smartphone ha sido evaluado exitosamente.",
      });

      // Switch to devices tab
      setActiveTab("devices");
    } catch (error) {
      console.error("Error evaluating smartphone:", error);
      toast({
        title: "Error",
        description: "No se pudo evaluar el smartphone. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setEvaluatingNew(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 px-4 mx-auto max-w-7xl">
        <DashboardHeader />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="devices">Dispositivos</TabsTrigger>
            <TabsTrigger value="evaluate">Evaluar Nuevo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="devices" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-40 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Actual smartphone cards
                evaluations.map((evaluation, index) => (
                  <SmartphoneCard 
                    key={evaluation.id} 
                    data={evaluation}
                    isNew={evaluations.indexOf(evaluation) === 0 && index === 0}
                  />
                ))
              )}
            </div>
            
            {evaluations.length === 0 && !loading && (
              <div className="text-center p-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2">No hay dispositivos evaluados</h3>
                <p className="text-muted-foreground">
                  Cambia a la pestaña "Evaluar Nuevo" para comenzar.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="evaluate">
            <div className="max-w-3xl mx-auto">
              <SmartphoneEvaluationForm onSubmit={handleEvaluateNewSmartphone} loading={evaluatingNew} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
