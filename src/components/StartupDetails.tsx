import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const StartupDetails = ({ startup }: { startup: any }) => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{startup.name}</h2>
          <p className="text-muted-foreground">{startup.industry}</p>
        </div>
        <Badge variant={startup.status === 'active' ? 'default' : 'secondary'}>
          {startup.status}
        </Badge>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{startup.description}</p>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Founded</span>
              <span>{startup.founded_year}</span>
              
              <span className="text-muted-foreground">Team Size</span>
              <span>{startup.team_size || 'N/A'}</span>
              
              <span className="text-muted-foreground">Location</span>
              <span>{startup.location || 'N/A'}</span>
              
              <span className="text-muted-foreground">Business Model</span>
              <span>{startup.business_model || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funding Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Stage</span>
              <span>{startup.funding_stage || 'N/A'}</span>
              
              <span className="text-muted-foreground">Total Funding</span>
              <span>{startup.total_funding || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact & Links */}
      <Card>
        <CardHeader>
          <CardTitle>Contact & Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Contact Information</h4>
              <p>{startup.contact_email}</p>
              <p>{startup.contact_phone}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Links</h4>
              {startup.website && (
                <a 
                  href={startup.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  Website ↗
                </a>
              )}
              {startup.pitch_deck && (
                <a 
                  href={startup.pitch_deck} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  Pitch Deck ↗
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
