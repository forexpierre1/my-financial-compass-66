import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Crown, CreditCard } from "lucide-react";

export default function Settings() {
  return (
    <DashboardLayout title="Paramètres" subtitle="Gérez votre compte et vos préférences">
      <div className="max-w-3xl space-y-6">
        {/* Profile */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Profil</CardTitle>
                <CardDescription>Vos informations personnelles</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@exemple.com" />
              </div>
            </div>
            <Button>Sauvegarder</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Gérez vos alertes</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertes budget</p>
                <p className="text-sm text-muted-foreground">Recevoir une alerte quand un budget est dépassé</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Rappels objectifs</p>
                <p className="text-sm text-muted-foreground">Rappels hebdomadaires sur vos objectifs</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Résumé mensuel</p>
                <p className="text-sm text-muted-foreground">Rapport mensuel par email</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-purple-400" />
              <div>
                <CardTitle>Abonnement</CardTitle>
                <CardDescription>Gérez votre plan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div>
                <p className="font-medium">Plan Freemium</p>
                <p className="text-sm text-muted-foreground">Fonctionnalités de base</p>
              </div>
              <Button variant="premium">
                Passer Premium
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>Protégez votre compte</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input id="new-password" type="password" />
            </div>
            <Button>Changer le mot de passe</Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card variant="elevated" className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Zone de danger</CardTitle>
            <CardDescription>Actions irréversibles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Supprimer mon compte</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
