import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Types for our form items
type FormItemType = 'text' | 'select' | 'number' | 'file';

interface FormItemBase {
  id: string;
  type: FormItemType;
  label: string;
  name: string;
  required: boolean;
  description?: string;
}

interface TextInput extends FormItemBase {
  type: 'text';
  placeholder?: string;
}

interface SelectInput extends FormItemBase {
  type: 'select';
  options: string[];
}

interface NumberInput extends FormItemBase {
  type: 'number';
  min?: number;
  max?: number;
}

interface FileInput extends FormItemBase {
  type: 'file';
  acceptedFileTypes?: string[];
}

type FormItem = TextInput | SelectInput | NumberInput | FileInput;

interface CustomForm {
  id: string;
  name: string;
  items: FormItem[];
}

// Zod schema for form validation
const formItemSchema = z.object({
  type: z.enum(['text', 'select', 'number', 'file']),
  label: z.string().min(1, 'Label is required'),
  name: z.string().min(1, 'Name is required'),
  required: z.boolean().default(false),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  options: z.string().optional(),
  min: z.string().optional(),
  max: z.string().optional(),
  acceptedFileTypes: z.string().optional(),
});

// Add new types for form submission
interface FormData {
  [key: string]: string | number | File | null;
}

interface FormSubmission {
  id: string;
  formId: string;
  data: FormData;
  submittedAt: string;
}

// Add this helper function to format the output
const formatOutputValue = (value: unknown): string => {
  if (value === null || value === undefined) return 'Not provided';
  if (value instanceof File) return `File: ${value.name}`;
  return String(value);
};

export default function FormBuilder() {
  const [forms, setForms] = useState<CustomForm[]>([]);
  const [currentForm, setCurrentForm] = useState<CustomForm>({
    id: crypto.randomUUID(),
    name: 'New Form',
    items: [],
  });
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [formOutput, setFormOutput] = useState<FormData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const form = useForm({
    resolver: zodResolver(formItemSchema),
    defaultValues: {
      type: 'text',
      label: '',
      name: '',
      required: false,
      description: '',
      placeholder: '',
      options: '',
      min: '',
      max: '',
      acceptedFileTypes: '',
    },
  });

  // Watch the type field to show/hide conditional fields
  const watchType = form.watch('type');

  // Load forms and submissions from localStorage only once on mount
  useEffect(() => {
    try {
      const savedForms = localStorage.getItem('customForms');
      const savedSubmissions = localStorage.getItem('formSubmissions');

      if (savedForms) {
        setForms(JSON.parse(savedForms));
      }

      if (savedSubmissions) {
        setSubmissions(JSON.parse(savedSubmissions));
      }

      setIsInitialized(true);
    } catch (error) {
      setIsInitialized(true);
    }
  }, []);

  // Save forms to localStorage only after initial load
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('customForms', JSON.stringify(forms));
      } catch (error) {
        // Handle error if needed
      }
    }
  }, [forms, isInitialized]);

  // Save submissions to localStorage only after initial load
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('formSubmissions', JSON.stringify(submissions));
      } catch (error) {
        // Handle error if needed
      }
    }
  }, [submissions, isInitialized]);

  const onSubmit = (values: z.infer<typeof formItemSchema>) => {
    const newItem = {
      id: crypto.randomUUID(),
      type: values.type,
      label: values.label,
      name: values.name,
      required: values.required,
      description: values.description,
      ...(values.type === 'text' && { placeholder: values.placeholder }),
      ...(values.type === 'select' && {
        options: values.options?.split(',').map((opt) => opt.trim()) || [],
      }),
      ...(values.type === 'number' && {
        min: Number(values.min),
        max: Number(values.max),
      }),
      ...(values.type === 'file' && {
        acceptedFileTypes: values.acceptedFileTypes
          ?.split(',')
          .map((type) => type.trim()),
      }),
    } as FormItem;

    setCurrentForm((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    form.reset();
  };

  const saveForm = () => {
    if (selectedForm) {
      setForms((prev) =>
        prev.map((f) => (f.id === currentForm.id ? currentForm : f)),
      );
    } else {
      setForms((prev) => [...prev, currentForm]);
    }

    setCurrentForm({
      id: crypto.randomUUID(),
      name: 'New Form',
      items: [],
    });
    setSelectedForm(null);
  };

  // Delete a form
  const deleteForm = (formId: string) => {
    setForms((prev) => prev.filter((f) => f.id !== formId));
    setSubmissions((prev) => prev.filter((s) => s.formId !== formId));

    if (selectedForm === formId) {
      setSelectedForm(null);
      setCurrentForm({
        id: crypto.randomUUID(),
        name: 'New Form',
        items: [],
      });
    }
  };

  // Delete a form item
  const deleteFormItem = (itemId: string) => {
    setCurrentForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  // Function to handle form submission in preview mode
  const handlePreviewSubmit = (formId: string, data: FormData) => {
    const submission: FormSubmission = {
      id: crypto.randomUUID(), // Add unique ID for submissions
      formId,
      data,
      submittedAt: new Date().toISOString(),
    };

    setSubmissions((prev) => [...prev, submission]);
    setFormOutput(data);
  };

  // Function to view a saved form
  const viewForm = (formId: string) => {
    setSelectedFormId(formId);
    setFormOutput(null);
  };

  // Add a separate form for the form name
  const nameForm = useForm({
    defaultValues: {
      formName: currentForm.name,
    },
  });

  // Update the form name when it changes
  useEffect(() => {
    nameForm.setValue('formName', currentForm.name);
  }, [currentForm.name, nameForm]);

  const updateFormName = (name: string) => {
    setCurrentForm((prev) => ({
      ...prev,
      name,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="builder" className="space-y-4">
        <TabsList>
          <TabsTrigger value="builder">Form Builder</TabsTrigger>
          <TabsTrigger value="preview">Form Preview</TabsTrigger>
          <TabsTrigger value="step">Step by Step</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Form Builder Section */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedForm ? 'Edit Form' : 'Create New Form'}
                </CardTitle>
                <CardDescription>
                  Create your form by adding different types of inputs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Form name input with its own Form context */}
                <div className="mb-6">
                  <Form {...nameForm}>
                    <form className="space-y-4">
                      <FormField
                        control={nameForm.control}
                        name="formName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Form Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter form name"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  updateFormName(e.target.value);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select input type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="select">Select</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="file">File</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter label" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter field name" {...field} />
                          </FormControl>
                          <FormDescription>
                            This will be used as the field identifier
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="required"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Required
                            </FormLabel>
                            <FormDescription>
                              Make this field required
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Conditional fields based on type */}
                    {watchType === 'text' && (
                      <FormField
                        control={form.control}
                        name="placeholder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Placeholder</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter placeholder text"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}

                    {watchType === 'select' && (
                      <FormField
                        control={form.control}
                        name="options"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Options</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter options (comma-separated)"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter options separated by commas
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    )}

                    {watchType === 'number' && (
                      <>
                        <FormField
                          control={form.control}
                          name="min"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Value</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter minimum value"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="max"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Value</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter maximum value"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {watchType === 'file' && (
                      <FormField
                        control={form.control}
                        name="acceptedFileTypes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Accepted File Types</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter file types (e.g., .pdf,.doc)"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter file extensions separated by commas
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    )}

                    <Button type="submit">Add Field</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card>
              <CardHeader>
                <CardTitle>Form Preview</CardTitle>
                <CardDescription>
                  Preview of your form with {currentForm.items.length} items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentForm.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative rounded border p-4 pr-12"
                    >
                      <button
                        onClick={() => deleteFormItem(item.id)}
                        className="absolute right-2 top-2 text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <h3 className="font-medium">
                        {item.label}
                        {item.required && (
                          <span className="ml-1 text-destructive">*</span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {item.type}
                      </p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      {/* Type-specific previews */}
                      {item.type === 'text' && (
                        <Input
                          className="mt-2"
                          placeholder={item.placeholder}
                          disabled
                        />
                      )}
                      {item.type === 'select' && (
                        <Select disabled>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {(item as SelectInput).options.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {item.type === 'number' && (
                        <Input
                          className="mt-2"
                          type="number"
                          min={(item as NumberInput).min}
                          max={(item as NumberInput).max}
                          disabled
                        />
                      )}
                      {item.type === 'file' && (
                        <Input
                          className="mt-2"
                          type="file"
                          accept={(item as FileInput).acceptedFileTypes?.join(
                            ',',
                          )}
                          disabled
                        />
                      )}
                    </div>
                  ))}
                  {currentForm.items.length > 0 && (
                    <Button onClick={saveForm}>
                      {selectedForm ? 'Update Form' : 'Save Form'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="preview">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Form List */}
            <Card>
              <CardHeader>
                <CardTitle>Saved Forms</CardTitle>
                <CardDescription>
                  Select a form to preview and test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forms.map((form) => (
                    <div
                      key={form.id}
                      className={cn(
                        'flex items-center justify-between rounded border p-4',
                        selectedFormId === form.id && 'border-primary',
                      )}
                    >
                      <div>
                        <h3 className="font-medium">{form.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {form.items.length} items
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {
                            submissions.filter((s) => s.formId === form.id)
                              .length
                          }{' '}
                          submissions
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => viewForm(form.id)}
                        >
                          View Form
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => deleteForm(form.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Form Preview and Output */}
            <div className="space-y-4">
              {selectedFormId && (
                <PreviewForm
                  form={forms.find((f) => f.id === selectedFormId)!}
                  onSubmit={handlePreviewSubmit}
                />
              )}

              {formOutput && selectedFormId && (
                <FormOutputDisplay
                  form={forms.find((f) => f.id === selectedFormId)!}
                  data={formOutput}
                />
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="step">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Form List */}
            <Card>
              <CardHeader>
                <CardTitle>Saved Forms</CardTitle>
                <CardDescription>
                  Select a form to start the questionnaire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forms.map((form) => (
                    <div
                      key={form.id}
                      className={cn(
                        'flex items-center justify-between rounded border p-4',
                        selectedFormId === form.id && 'border-primary',
                      )}
                    >
                      <div>
                        <h3 className="font-medium">{form.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {form.items.length} questions
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => viewForm(form.id)}
                      >
                        Start
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step by Step Form */}
            <div className="space-y-4">
              {selectedFormId && (
                <StepByStepForm
                  form={forms.find((f) => f.id === selectedFormId)!}
                  onSubmit={handlePreviewSubmit}
                />
              )}

              {formOutput && selectedFormId && (
                <FormOutputDisplay
                  form={forms.find((f) => f.id === selectedFormId)!}
                  data={formOutput}
                />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Add new PreviewForm component
interface PreviewFormProps {
  form: CustomForm;
  onSubmit: (formId: string, data: FormData) => void;
}

function PreviewForm({ form, onSubmit }: PreviewFormProps) {
  const formSchema = z.object(
    form.items.reduce((acc, item) => {
      let schema: z.ZodType;

      switch (item.type) {
        case 'text':
          schema = z.string();
          break;
        case 'number':
          schema = z.coerce.number();
          break;
        case 'select':
          schema = z.string();
          break;
        case 'file':
          schema = z.instanceof(File).nullable();
          break;
        default:
          schema = z.string();
      }

      if (!item.required) {
        schema = schema.optional();
      }

      return { ...acc, [item.name]: schema };
    }, {}),
  );

  const previewForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: form.items.reduce(
      (acc, item) => ({
        ...acc,
        [item.name]: '',
      }),
      {},
    ),
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(form.id, values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.name}</CardTitle>
        <CardDescription>Fill out the form to test it</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...previewForm}>
          <form
            onSubmit={previewForm.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {form.items.map((item) => (
              <FormField
                key={item.id}
                control={previewForm.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {item.label}
                      {item.required && (
                        <span className="ml-1 text-destructive">*</span>
                      )}
                    </FormLabel>
                    {item.type === 'text' && (
                      <FormControl>
                        <Input
                          placeholder={(item as TextInput).placeholder}
                          {...field}
                        />
                      </FormControl>
                    )}
                    {item.type === 'select' && (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(item as SelectInput).options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {item.type === 'number' && (
                      <FormControl>
                        <Input
                          type="number"
                          min={(item as NumberInput).min}
                          max={(item as NumberInput).max}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? '' : Number(value));
                          }}
                        />
                      </FormControl>
                    )}
                    {item.type === 'file' && (
                      <FormControl>
                        <Input
                          type="file"
                          accept={(item as FileInput).acceptedFileTypes?.join(
                            ',',
                          )}
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            field.onChange(file);
                          }}
                        />
                      </FormControl>
                    )}
                    {item.description && (
                      <FormDescription>{item.description}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit">Submit Form</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Add this new component for formatted output
function FormOutputDisplay({
  form,
  data,
}: {
  form: CustomForm;
  data: FormData;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Submission</CardTitle>
        <CardDescription>
          Submitted at {format(new Date(), 'PPpp')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {form.items.map((item) => (
            <div key={item.id} className="border-b pb-2 last:border-none">
              <div className="text-sm font-medium text-muted-foreground">
                {item.label}
              </div>
              <div className="mt-1">{formatOutputValue(data[item.name])}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface StepByStepFormProps {
  form: CustomForm;
  onSubmit: (formId: string, data: FormData) => void;
}

function StepByStepForm({ form, onSubmit }: StepByStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const currentItem = form.items[currentStep];
  const isLastStep = currentStep === form.items.length - 1;

  // Create a form schema for just the current field instead of all fields
  const currentFieldSchema = z.object({
    [currentItem.name]: (() => {
      let schema: z.ZodType;
      switch (currentItem.type) {
        case 'text':
          schema = z.string();
          break;
        case 'number':
          schema = z.coerce.number();
          break;
        case 'select':
          schema = z.string();
          break;
        case 'file':
          schema = z.instanceof(File).nullable();
          break;
        default:
          schema = z.string();
      }
      return currentItem.required ? schema : schema.optional();
    })(),
  });

  const stepForm = useForm<z.infer<typeof currentFieldSchema>>({
    resolver: zodResolver(currentFieldSchema),
    defaultValues: {
      [currentItem.name]: formData[currentItem.name] || '',
    },
  });

  const onStepSubmit = stepForm.handleSubmit((values) => {
    const updatedData = {
      ...formData,
      [currentItem.name]: values[currentItem.name],
    };
    setFormData(updatedData);

    if (isLastStep) {
      onSubmit(form.id, updatedData);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  });

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.name}</CardTitle>
        <CardDescription>
          Question {currentStep + 1} of {form.items.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...stepForm}>
          <form onSubmit={onStepSubmit} className="space-y-4">
            <FormField
              key={currentItem.id}
              control={stepForm.control}
              name={currentItem.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {currentItem.label}
                    {currentItem.required && (
                      <span className="ml-1 text-destructive">*</span>
                    )}
                  </FormLabel>
                  {currentItem.type === 'text' && (
                    <FormControl>
                      <Input
                        placeholder={(currentItem as TextInput).placeholder}
                        {...field}
                      />
                    </FormControl>
                  )}
                  {currentItem.type === 'select' && (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(currentItem as SelectInput).options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {currentItem.type === 'number' && (
                    <FormControl>
                      <Input
                        type="number"
                        min={(currentItem as NumberInput).min}
                        max={(currentItem as NumberInput).max}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : Number(value));
                        }}
                      />
                    </FormControl>
                  )}
                  {currentItem.type === 'file' && (
                    <FormControl>
                      <Input
                        type="file"
                        accept={(
                          currentItem as FileInput
                        ).acceptedFileTypes?.join(',')}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          field.onChange(file);
                        }}
                      />
                    </FormControl>
                  )}
                  {currentItem.description && (
                    <FormDescription>{currentItem.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button type="submit">{isLastStep ? 'Submit' : 'Next'}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
