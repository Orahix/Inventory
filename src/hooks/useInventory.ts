@@ .. @@
   const addItem = async (itemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
     setLoading(true);
     setError(null);
     try {
-      const { data, error } = await supabase
+      const { data, error: insertError } = await supabase
         .from('inventory_items')
         .insert([itemData])
         .select()
         .single();
 
-      if (error) throw error;
+      if (insertError) throw insertError;
       
       setItems(prev => [...prev, data]);
+      return data;
     } catch (err) {
       const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
       setError(errorMessage);
+      throw err;
     } finally {
       setLoading(false);
     }
@@ .. @@
   const updateItem = async (id: string, itemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
     setLoading(true);
     setError(null);
     try {
-      const { data, error } = await supabase
+      const { data, error: updateError } = await supabase
         .from('inventory_items')
         .update(itemData)
         .eq('id', id)
         .select()
         .single();
 
-      if (error) throw error;
+      if (updateError) throw updateError;
       
       setItems(prev => prev.map(item => item.id === id ? data : item));
+      return data;
     } catch (err) {
       const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
       setError(errorMessage);
+      throw err;
     } finally {
       setLoading(false);
     }
@@ .. @@
   const deleteItem = async (id: string) => {
     setLoading(true);
     setError(null);
     try {
-      const { error } = await supabase
+      const { error: deleteError } = await supabase
         .from('inventory_items')
         .delete()
         .eq('id', id);
 
-      if (error) throw error;
+      if (deleteError) throw deleteError;
       
       setItems(prev => prev.filter(item => item.id !== id));
     } catch (err) {
       const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
       setError(errorMessage);
+      throw err;
     } finally {
       setLoading(false);
     }