import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { api } from "../services/api";
import { PageHeader } from "../components/layout/PageHeader";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { ImageUpload } from "../components/form/ImageUpload";
import { validateGameForm } from "../utils/formValidation";
import { KEY_TYPE_OPTIONS, type KeyType } from "../types/keyType";

export const CreateGame = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageBase64Strings, setImageBase64Strings] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    discount: string;
    keyType: KeyType | "";
    creatorEmail: string;
  }>({
    name: "",
    price: "",
    discount: "",
    keyType: "",
    creatorEmail: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Convert string values to numbers for validation and submission
    const numericFormData = {
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      discount: parseFloat(formData.discount) || 0,
      keyType: formData.keyType as KeyType,
      creatorEmail: formData.creatorEmail,
    };

    // Client-side validation
    const validationErrors = validateGameForm(numericFormData);
    const firstError = Object.values(validationErrors)[0];
    if (firstError) {
      setError(firstError);
      return;
    }

    setLoading(true);

    try {
      await api.createGame({
        ...numericFormData,
        photoUrls: imageBase64Strings,
      });
      navigate("/");
    } catch (err) {
      const errorMessage =
        (isAxiosError<{ error?: string }>(err) && err.response?.data?.error) ||
        "Failed to create game. Please try again.";
      setError(errorMessage);
      console.error("Error creating game:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page py-6 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <PageHeader
          title="Create New Game Listing"
          subtitle="Add a new game key to the marketplace"
          backTo="/"
          backLabel="Back to Gallery"
        />

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-raised rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          {error && <ErrorMessage message={error} />}

          <Input
            label="Game Name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Split Fiction"
          />

          <ImageUpload
            images={imageBase64Strings}
            onImagesChange={setImageBase64Strings}
            onError={setError}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Price (€)"
              name="price"
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="49.99"
            />

            <Input
              label="Discount (%)"
              name="discount"
              type="number"
              min="0"
              max="100"
              step="1"
              value={formData.discount}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <Select
            label="Type of Key"
            name="keyType"
            required
            value={formData.keyType}
            onChange={handleChange}
            placeholder="Select a key type"
            options={KEY_TYPE_OPTIONS.map((keyType) => ({
              value: keyType,
              label: keyType,
            }))}
          />

          <Input
            label="Creator Email"
            name="creatorEmail"
            type="email"
            required
            value={formData.creatorEmail}
            onChange={handleChange}
            placeholder="seller@example.com"
          />

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/")}
              className="flex-1 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 w-full sm:w-auto"
            >
              {loading ? "Publishing..." : "Publish Game"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
